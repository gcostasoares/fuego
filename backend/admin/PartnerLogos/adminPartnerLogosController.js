const sql      = require("mssql");
const { v4: uuidv4 } = require("uuid");
const fs       = require("fs/promises");
const path     = require("path");

const LOGO_DIR = path.join(__dirname, "../../public/images/PartnerLogos");

function pool() {
  if (!global.pool) throw new Error("Pool not ready");
  return global.pool;
}

/* ───────────────────────── helpers ───────────────────────── */
const safeRename = async (oldAbs, newAbs) => {
  try {
    await fs.rename(oldAbs, newAbs);
  } catch (err) {
    if (err.code === "ENOENT") {
      /* Quelle existiert schon nicht mehr – egal */
      return;
    }
    if (err.code === "EEXIST") {
      /* Ziel gibt es schon (kann in Phase A passieren) */
      await fs.unlink(newAbs);           // löschen & erneut probieren
      await fs.rename(oldAbs, newAbs);
      return;
    }
    throw err;                           // alles andere ist fatal
  }
};

/* strip prefix 01- 02- … */
const stripPrefix = (s) => s.replace(/^\d+\s*-\s*/, "");

/* ───────────────────────── LIST/GET/CREATE/DELETE (unverändert) ────────── */
exports.listPartnerLogos = async (_, res) => {
  const { recordset } = await pool().request().query(`
    SELECT Id AS id, ImagePath AS imagePath
    FROM   tblPartnerLogos
    ORDER  BY ImagePath`);
  res.json(recordset);
};

exports.getPartnerLogo = async (req, res) => {
  const { id } = req.params;
  const r = await pool().request()
    .input("id", sql.UniqueIdentifier, id)
    .query("SELECT Id AS id, ImagePath AS imagePath FROM tblPartnerLogos WHERE Id=@id");
  if (!r.recordset.length) return res.status(404).json({ error: "Not found" });
  res.json(r.recordset[0]);
};

exports.createPartnerLogo = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image file" });
  const id = uuidv4();
  await pool().request()
    .input("id",        sql.UniqueIdentifier, id)
    .input("imagePath", sql.NVarChar,         req.file.filename)
    .query("INSERT INTO tblPartnerLogos (Id,ImagePath) VALUES (@id,@imagePath)");
  res.status(201).json({ id });
};

exports.deletePartnerLogo = async (req, res) => {
  const { id } = req.params;
  const rq = pool().request().input("id", sql.UniqueIdentifier, id);
  const { recordset } = await rq.query("SELECT ImagePath FROM tblPartnerLogos WHERE Id=@id");
  if (!recordset.length) return res.status(404).json({ error: "Not found" });

  await rq.query("DELETE FROM tblPartnerLogos WHERE Id=@id");
  fs.unlink(path.join(LOGO_DIR, recordset[0].ImagePath)).catch(() => {});
  res.json({ ok: true });
};

/* ───────────────────────── UPDATE (re-upload ODER reorder) ─────────────── */
exports.updatePartnerLogo = async (req, res) => {
  const { id } = req.params;
  const newFile   = req.file?.filename || null;   // wenn ein neues Bild kam
  const newName   = req.body.imagePath || null;   // wenn nur umbenennen

  if (!newFile && !newName) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  /* aktuellen Pfad holen */
  const rq  = pool().request().input("id", sql.UniqueIdentifier, id);
  const cur = await rq.query("SELECT ImagePath FROM tblPartnerLogos WHERE Id=@id");
  if (!cur.recordset.length) return res.status(404).json({ error: "Not found" });

  const oldName = cur.recordset[0].ImagePath;
  let   final   = oldName;          // Fallback → bleibt wie es ist

  /* ------------ A) Neues Bild hochgeladen ------------------------------ */
  if (newFile) {
    final = newFile;
    fs.unlink(path.join(LOGO_DIR, oldName)).catch(() => {});
  }

  /* ------------ B) Nur Umbenennung / Reorder --------------------------- */
  if (!newFile && newName && newName !== oldName) {
    const oldAbs = path.join(LOGO_DIR, oldName);
    const newAbs = path.join(LOGO_DIR, newName);

    /* 2-Phasen-Rename, um kollisionsfrei zu sein */
    const tmpName = "__tmp__" + uuidv4() + "-" + stripPrefix(oldName);
    const tmpAbs  = path.join(LOGO_DIR, tmpName);

    try {
      // Phase A → temporär
      await safeRename(oldAbs, tmpAbs);
      // Phase B → endgültig
      await safeRename(tmpAbs, newAbs);
      final = newName;
    } catch (err) {
      console.error("Rename failed:", err);
      // keine harte Fehlermeldung – wir updaten wenigstens die DB,
      // damit Reihenfolge erhalten bleibt
      final = newName;
    }
  }

  /* ------------ DB-Update (immer) -------------------------------------- */
  await pool().request()
    .input("id",        sql.UniqueIdentifier, id)
    .input("imagePath", sql.NVarChar,         final)
    .query("UPDATE tblPartnerLogos SET ImagePath=@imagePath WHERE Id=@id");

  res.json({ ok: true, imagePath: final });
};
