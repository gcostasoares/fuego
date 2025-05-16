/* admin/AppContent/adminAppContentController.js */
const sql  = require("mssql");
const { v4: uuidv4 } = require("uuid");

/* helper ------------------------------------------------------------------ */
function getPool() {
  if (!global.pool) throw new Error("Database not initialised");
  return global.pool;
}

/* column list once, so we can reuse it ------------------------------------ */
const COLS = [
  "SeoTitle", "SeoKeys", "ContentType", "URL", "SeoDescription",
  "AboutTitle", "AboutDescription", "Imprint", "DataProtection",
  "CookiePolicy", "ShopSectionDescription", "ShopSectionTitle"
];

/* ── READ: list with basic paging (optional) ─────────────────────────────── */
exports.getAllAppContent = async (req, res) => {
  try {
    const pool       = getPool();
    const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
    const pageSize   = parseInt(req.query.pageSize,   10) || 20;
    const offset     = (pageNumber - 1) * pageSize;

    const count = await pool.request()
      .query("SELECT COUNT(*) AS total FROM tblAppContent");

    const data  = await pool.request()
      .input("offset",   sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT
          Id AS id,
          ${COLS.map(c => `${c} AS ${c[0].toLowerCase()}${c.slice(1)}`).join(",\n          ")}
        FROM tblAppContent
        ORDER BY Id
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json({ appContent: data.recordset, totalCount: count.recordset[0].total });
  } catch (err) {
    console.error("Error fetching AppContent:", err);
    res.status(500).json({ error: "Failed to fetch AppContent", details: err.message });
  }
};

/* ── READ: single row by ID ──────────────────────────────────────────────── */
exports.getAppContentById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id AS id,
          ${COLS.map(c => `${c} AS ${c[0].toLowerCase()}${c.slice(1)}`).join(",\n          ")}
        FROM tblAppContent
        WHERE Id = @id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "AppContent not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching AppContent row:", err);
    res.status(500).json({ error: "Failed to fetch AppContent", details: err.message });
  }
};

/* ── CREATE ──────────────────────────────────────────────────────────────── */
exports.createAppContent = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4().toUpperCase();

    const rq = pool.request().input("Id", sql.UniqueIdentifier, id);
    COLS.forEach(col => rq.input(col, sql.NVarChar(sql.MAX), req.body[col] ?? null));

    await rq.query(`
      INSERT INTO tblAppContent
        (Id, ${COLS.join(", ")})
      VALUES
        (@Id, ${COLS.map(c => "@" + c).join(", ")})
    `);

    res.status(201).json({ success: true, appContentId: id });
  } catch (err) {
    console.error("Error creating AppContent:", err);
    res.status(500).json({ error: "Failed to create AppContent", details: err.message });
  }
};

/* ── UPDATE ──────────────────────────────────────────────────────────────── */
exports.updateAppContent = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const rq = pool.request().input("Id", sql.UniqueIdentifier, id);
    COLS.forEach(col => {
      if (col in req.body) rq.input(col, sql.NVarChar(sql.MAX), req.body[col]);
    });

    await rq.query(`
      UPDATE tblAppContent
      SET
        ${COLS.filter(c => c in req.body).map(c => `${c} = @${c}`).join(",\n        ")}
      WHERE Id = @Id
    `);

    res.json({ message: "AppContent updated successfully" });
  } catch (err) {
    console.error("Error updating AppContent:", err);
    res.status(500).json({ error: "Failed to update AppContent", details: err.message });
  }
};

/* ── DELETE ──────────────────────────────────────────────────────────────── */
exports.deleteAppContent = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query("DELETE FROM tblAppContent WHERE Id = @Id");

    res.json({ message: "AppContent deleted successfully" });
  } catch (err) {
    console.error("Error deleting AppContent:", err);
    res.status(500).json({ error: "Failed to delete AppContent", details: err.message });
  }
};

