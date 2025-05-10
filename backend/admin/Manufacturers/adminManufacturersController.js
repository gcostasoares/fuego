const sql   = require("mssql");
const fs    = require("fs");
const path  = require("path");
const { v4: uuidv4 } = require("uuid");

// public/images/Manufacturers
const IMAGE_DIR = path.join(__dirname, "../../public/images/Manufacturers");

function getPool() {
  if (!global.pool) throw new Error("Database not initialized");
  return global.pool;
}

exports.listManufacturers = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT Id, Name, ImagePath
      FROM tblManufacturers
      ORDER BY Name
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error listing manufacturers:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getManufacturerById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const result = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`
        SELECT Id, Name, ImagePath
        FROM tblManufacturers
        WHERE Id = @Id
      `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching manufacturer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createManufacturer = async (req, res) => {
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
        INSERT INTO tblManufacturers (Id, Name, ImagePath)
        VALUES (@Id, @Name, @ImagePath)
      `);

    res.status(201).json({ message: "Manufacturer created", id });
  } catch (err) {
    console.error("Error creating manufacturer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateManufacturer = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    // remove old file
    const oldRes = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`SELECT ImagePath FROM tblManufacturers WHERE Id = @Id`);
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
      UPDATE tblManufacturers
      SET Name = @Name
      ${newImage ? ", ImagePath = @ImagePath" : ""}
      WHERE Id = @Id
    `);

    res.json({ message: "Manufacturer updated" });
  } catch (err) {
    console.error("Error updating manufacturer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteManufacturer = async (req, res) => {
  try {
    const pool = getPool();
    await pool.request()
      .input("Id", sql.UniqueIdentifier, req.params.id)
      .query(`DELETE FROM tblManufacturers WHERE Id = @Id`);
    res.json({ message: "Manufacturer deleted" });
  } catch (err) {
    console.error("Error deleting manufacturer:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
