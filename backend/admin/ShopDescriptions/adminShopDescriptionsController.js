// admin/ShopDescriptions/adminShopDescriptionsController.js
const sql      = require("mssql");
const { v4: uuidv4 } = require("uuid");
const fs       = require("fs/promises");
const path     = require("path");

// Image dir
const IMG_DIR = path.join(__dirname, "../../../public/images/ShopDescriptions");

async function safeRename(oldAbs, newAbs) {
  try {
    await fs.rename(oldAbs, newAbs);
  } catch (err) {
    if (err.code === "ENOENT") return;
    if (err.code === "EEXIST") {
      await fs.unlink(newAbs);
      await fs.rename(oldAbs, newAbs);
      return;
    }
    throw err;
  }
}
function stripPrefix(s) {
  return s.replace(/^\d+\s*-\s*/, "");
}
function pool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}

// Bulk reorder
async function orderDescriptions(req, res) {
  try {
    let { order } = req.body;
    if (!Array.isArray(order) && typeof order === "string") {
      order = JSON.parse(order);
    }
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: "Bad order array", received: req.body });
    }

    const tx = new sql.Transaction(pool());
    await tx.begin();
    for (let i = 0; i < order.length; i++) {
      await tx.request()
        .input("id",   sql.UniqueIdentifier, order[i])
        .input("sort", sql.Int,              i + 1)
        .query(`UPDATE tblShopDescriptions SET SortOrder=@sort WHERE Id=@id`);
    }
    await tx.commit();
    res.json({ ok: true });
  } catch (err) {
    console.error("orderDescriptions error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// List
async function listDescriptions(req, res) {
  try {
    const result = await pool()
      .request()
      .query("SELECT Id AS id, Title, Description, ImagePath FROM tblShopDescriptions ORDER BY SortOrder");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get one
async function getDescription(req, res) {
  try {
    const { id } = req.params;
    const result = await pool()
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query("SELECT Id AS id, Title, Description, ImagePath FROM tblShopDescriptions WHERE Id=@id");
    if (!result.recordset.length) return res.status(404).json({ error: "Not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Create
async function createDescription(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No image file uploaded" });
    const id = uuidv4();
    const mx = await pool().request().query("SELECT ISNULL(MAX(SortOrder),0) AS maxSort FROM tblShopDescriptions");
    const nextSort = (mx.recordset[0].maxSort || 0) + 1;

    await pool().request()
      .input("id", sql.UniqueIdentifier, id)
      .input("title", sql.NVarChar, (req.body.title||"(Ohne Titel)").trim())
      .input("description", sql.NVarChar, req.body.description||"")
      .input("imagePath", sql.NVarChar, req.file.filename)
      .input("sort", sql.Int, nextSort)
      .query("INSERT INTO tblShopDescriptions (Id,Title,Description,ImagePath,SortOrder) VALUES (@id,@title,@description,@imagePath,@sort)");

    res.status(201).json({ id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update or catch bulk
async function updateDescription(req, res) {
  if (req.params.id === "order") {
    return orderDescriptions(req, res);
  }

  try {
    const { id } = req.params;
    const newFile = req.file ? req.file.filename : null;
    const newName = req.body.imagePath || null;
    const newSort = req.body.sort != null ? parseInt(req.body.sort, 10) : null;

    const cur = await pool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query("SELECT Title,Description,ImagePath FROM tblShopDescriptions WHERE Id=@id");
    if (!cur.recordset.length) return res.status(404).json({ error: "Not found" });

    let finalImage = cur.recordset[0].ImagePath;

    // replace upload
    if (newFile) {
      finalImage = newFile;
      if (cur.recordset[0].ImagePath) fs.unlink(path.join(IMG_DIR, cur.recordset[0].ImagePath)).catch(()=>{});
    }

    // rename existing
    if (!newFile && newName && newName !== cur.recordset[0].ImagePath) {
      const oldAbs = path.join(IMG_DIR, cur.recordset[0].ImagePath);
      const tmp   = "__tmp__"+uuidv4()+"-"+stripPrefix(cur.recordset[0].ImagePath);
      const tmpAbs= path.join(IMG_DIR, tmp);
      const newAbs= path.join(IMG_DIR, newName);
      await safeRename(oldAbs, tmpAbs);
      await safeRename(tmpAbs, newAbs);
      finalImage = newName;
    }

    // build update
    let q = "UPDATE tblShopDescriptions SET Title=@title,Description=@description,ImagePath=@imagePath";
    if (newSort !== null) q += ",SortOrder=@sort";
    q += " WHERE Id=@id";

    const r = pool().request()
      .input("id", sql.UniqueIdentifier, id)
      .input("title", sql.NVarChar, (req.body.title||cur.recordset[0].Title).trim())
      .input("description", sql.NVarChar, req.body.description||cur.recordset[0].Description)
      .input("imagePath", sql.NVarChar, finalImage);
    if (newSort !== null) r.input("sort", sql.Int, newSort);
    await r.query(q);

    res.json({ ok: true, imagePath: finalImage });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Delete
async function deleteDescription(req, res) {
  try {
    const { id } = req.params;
    const cur = await pool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query("SELECT ImagePath FROM tblShopDescriptions WHERE Id=@id");
    if (!cur.recordset.length) return res.status(404).json({ error: "Not found" });

    await pool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query("DELETE FROM tblShopDescriptions WHERE Id=@id");

    if (cur.recordset[0].ImagePath) fs.unlink(path.join(IMG_DIR, cur.recordset[0].ImagePath)).catch(()=>{});
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  listDescriptions,
  getDescription,
  createDescription,
  updateDescription,
  deleteDescription,
  orderDescriptions,
};
