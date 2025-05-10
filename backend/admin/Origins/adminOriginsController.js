const sql   = require("mssql");
const fs    = require("fs");
const path  = require("path");
const { v4: uuidv4 } = require("uuid");

// two levels up → public/images/Origins
const IMAGE_DIR = path.join(__dirname, "../../public/images/Origins");

function getPool() {
  if (!global.pool) throw new Error("Database not initialized");
  return global.pool;
}

exports.listOrigins = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT Id, Name, ImagePath
      FROM tblOrigins
      ORDER BY Name
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error listing origins:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOriginById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`
        SELECT Id, Name, ImagePath
        FROM tblOrigins
        WHERE Id = @Id
      `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Origin not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching origin:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createOrigin = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4().toUpperCase();
    const { name } = req.body;
    const imagePath = req.file?.filename || null;

    await pool.request()
      .input("Id",       sql.UniqueIdentifier, id)
      .input("Name",     sql.NVarChar,         name)
      .input("ImagePath",sql.NVarChar,         imagePath)
      .query(`
        INSERT INTO tblOrigins (Id, Name, ImagePath)
        VALUES (@Id, @Name, @ImagePath)
      `);

    res.status(201).json({ message: "Origin created", id });
  } catch (err) {
    console.error("Error creating origin:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateOrigin = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    // fetch old
    const oldRes = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`SELECT ImagePath FROM tblOrigins WHERE Id = @Id`);
    const oldImage = oldRes.recordset[0]?.ImagePath;

    const newImage = req.file?.filename;
    if (newImage && oldImage) {
      const oldPath = path.join(IMAGE_DIR, oldImage);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const reqQ = pool.request()
      .input("Id",   sql.UniqueIdentifier, id)
      .input("Name", sql.NVarChar,         req.body.name);

    if (newImage) {
      reqQ.input("ImagePath", sql.NVarChar, newImage);
    }

    await reqQ.query(`
      UPDATE tblOrigins
      SET Name = @Name
      ${newImage ? ", ImagePath = @ImagePath" : ""}
      WHERE Id = @Id
    `);

    res.json({ message: "Origin updated" });
  } catch (err) {
    console.error("Error updating origin:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteOrigin = async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input("Id", sql.UniqueIdentifier, req.params.id)
      .query(`DELETE FROM tblOrigins WHERE Id = @Id`);
    res.json({ message: "Origin deleted" });
  } catch (err) {
    console.error("Error deleting origin:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
