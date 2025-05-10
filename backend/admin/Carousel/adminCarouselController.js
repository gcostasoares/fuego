// backend/admin/Carousel/adminCarouselController.js
const sql = require("mssql");
const { v4: uuidv4 } = require("uuid");

/**
 * Helper to get the live pool.
 * Throws if called before your main sql.connect() has completed.
 */
function getPool() {
  if (!global.pool) {
    throw new Error("Database pool not initialized");
  }
  return global.pool;
}

/**
 * List all carousel entries
 */
exports.listCarousel = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(
      `SELECT
         Id          AS id,
         Title       AS title,
         SubTitle    AS subTitle,
         Description AS description,
         ImagePath   AS imagePath
       FROM tblCarousels
       ORDER BY Title`
    );
    res.json(result.recordset);
  } catch (err) {
    console.error("Carousel list error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Get one carousel entry by ID
 */
exports.getCarousel = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);
    const result = await request.query(
      `SELECT
         Id          AS id,
         Title       AS title,
         SubTitle    AS subTitle,
         Description AS description,
         ImagePath   AS imagePath
       FROM tblCarousels
       WHERE Id = @id`
    );
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Carousel entry not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Get carousel error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Create a new carousel entry
 */
exports.createCarousel = async (req, res) => {
  try {
    const pool = getPool();
    const id = uuidv4();
    let { title, subTitle, description } = req.body;
    const imagePath = req.file?.filename || null;

    // ← **NEW**: default title to "(Ohne Titel)" if blank/whitespace
    title = (title || "").trim() || "(Ohne Titel)";

    const request = pool.request();
    request.input("id",          sql.UniqueIdentifier, id);
    request.input("title",       sql.NVarChar,         title);
    request.input("subTitle",    sql.NVarChar,         subTitle);
    request.input("description", sql.NVarChar,         description);
    request.input("imagePath",   sql.NVarChar,         imagePath);

    await request.query(
      `INSERT INTO tblCarousels
         (Id, Title, SubTitle, Description, ImagePath)
       VALUES
         (@id, @title, @subTitle, @description, @imagePath)`
    );

    res.status(201).json({ message: "Carousel entry created", id });
  } catch (err) {
    console.error("Create carousel error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Update an existing carousel entry
 */
exports.updateCarousel = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const { title, subTitle, description } = req.body;
    const imagePath = req.file?.filename;

    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);
    request.input("title", sql.NVarChar, title);
    request.input("subTitle", sql.NVarChar, subTitle);
    request.input("description", sql.NVarChar, description);
    if (imagePath) {
      request.input("imagePath", sql.NVarChar, imagePath);
    }

    await request.query(
      `UPDATE tblCarousels
       SET
         Title       = @title,
         SubTitle    = @subTitle,
         Description = @description
         ${imagePath ? ", ImagePath = @imagePath" : ""}
       WHERE Id = @id`
    );

    res.json({ message: "Carousel entry updated" });
  } catch (err) {
    console.error("Update carousel error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * Delete a carousel entry
 */
exports.deleteCarousel = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);
    await request.query(`DELETE FROM tblCarousels WHERE Id = @id`);
    res.json({ message: "Carousel entry deleted" });
  } catch (err) {
    console.error("Delete carousel error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
