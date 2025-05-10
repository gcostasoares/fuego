const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");

/**
 * Helper to get the live pool.
 */
function getPool() {
  if (!global.pool) {
    throw new Error("Database pool not initialized");
  }
  return global.pool;
}

/**
 * List all thumbnail entries
 */
exports.listThumbnail = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        Id          AS id,
        Title       AS title,
        SubTitle    AS subTitle,
        Description AS description,
        ImagePath   AS imagePath
      FROM tblThumbnails
      ORDER BY Title
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Thumbnail list error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get one thumbnail entry by ID
 */
exports.getThumbnail = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);
    const result = await request.query(`
      SELECT
        Id          AS id,
        Title       AS title,
        SubTitle    AS subTitle,
        Description AS description,
        ImagePath   AS imagePath
      FROM tblThumbnails
      WHERE Id = @id
    `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Thumbnail entry not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Get thumbnail error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new thumbnail entry
 */
exports.createThumbnail = async (req, res) => {
  try {
    const pool = getPool();
    const id = uuidv4();
    let { title, subTitle, description } = req.body;
    const imagePath = req.file?.filename || null;

    // default title if blank
    title = (title || "").trim() || "(Ohne Titel)";

    const request = pool.request();
    request.input("id",          sql.UniqueIdentifier, id);
    request.input("title",       sql.NVarChar,         title);
    request.input("subTitle",    sql.NVarChar,         subTitle);
    request.input("description", sql.NVarChar,         description);
    request.input("imagePath",   sql.NVarChar,         imagePath);

    await request.query(`
      INSERT INTO tblThumbnails
        (Id, Title, SubTitle, Description, ImagePath)
      VALUES
        (@id, @title, @subTitle, @description, @imagePath)
    `);

    res.status(201).json({ message: "Thumbnail entry created", id });
  } catch (err) {
    console.error("Create thumbnail error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update an existing thumbnail entry
 */
exports.updateThumbnail = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { title, subTitle, description } = req.body;
    const imagePath = req.file?.filename;

    const request = pool.request();
    request.input("id",          sql.UniqueIdentifier, id);
    request.input("title",       sql.NVarChar,         title);
    request.input("subTitle",    sql.NVarChar,         subTitle);
    request.input("description", sql.NVarChar,         description);
    let sqlText = `
      UPDATE tblThumbnails
      SET
        Title       = @title,
        SubTitle    = @subTitle,
        Description = @description
    `;

    if (imagePath) {
      request.input("imagePath", sql.NVarChar, imagePath);
      sqlText += `, ImagePath = @imagePath`;
    }

    sqlText += ` WHERE Id = @id`;

    await request.query(sqlText);

    res.json({ message: "Thumbnail entry updated" });
  } catch (err) {
    console.error("Update thumbnail error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a thumbnail entry
 */
exports.deleteThumbnail = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);
    await request.query(`DELETE FROM tblThumbnails WHERE Id = @id`);
    res.json({ message: "Thumbnail entry deleted" });
  } catch (err) {
    console.error("Delete thumbnail error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
