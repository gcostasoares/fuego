// admin/GrowEquipments/adminGrowEquipmentsController.js
const sql       = require("mssql");
const fs        = require("fs");
const path      = require("path");
const { v4: uuidv4 } = require("uuid");

// Normalize user-entered price to two decimals
function parsePrice(input) {
  const str = (input ?? "").toString().trim().replace(/,/g, ".");
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return Math.round(num * 100) / 100;
}

function getPool() {
  if (!global.pool) throw new Error("Database not initialized");
  return global.pool;
}

// Folder for stored images
const IMAGE_DIR = path.join(__dirname, "../../public/images/GrowEquipments");

// ── List with pagination ───────────────────────────────────────────────
exports.getAllGrowEquipments = async (req, res) => {
  try {
    const pool       = getPool();
    const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
    const pageSize   = parseInt(req.query.pageSize,   10) || 10;
    const offset     = (pageNumber - 1) * pageSize;

    // total count
    const countResult = await pool.request()
      .query("SELECT COUNT(*) AS total FROM tblGrowEquipments");

    // paged data, converting time to "HH:mm"
    const dataResult = await pool.request()
      .input("offset",   sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT
          Id              AS id,
          Name            AS name,
          Description     AS description,
          Phone           AS phone,
          Email           AS email,
          Address         AS address,
          Price           AS price,
          StartDay        AS startDay,
          EndDay          AS endDay,
          CONVERT(varchar(5), StartTime, 108) AS startTime,
          CONVERT(varchar(5), EndTime,   108) AS endTime,
          ImagePath       AS imagePath,
          CoverImagePath  AS coverImagePath,
          IsVerified      AS isVerified
        FROM tblGrowEquipments
        ORDER BY Name
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json({
      growEquipments: dataResult.recordset,
      totalCount:     countResult.recordset[0].total
    });
  } catch (err) {
    console.error("Error fetching GrowEquipments:", err);
    res.status(500).json({ error: "Failed to fetch GrowEquipments", details: err.message });
  }
};

// ── Get single by ID ──────────────────────────────────────────────────
exports.getGrowEquipmentById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const result = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id              AS id,
          Name            AS name,
          Description     AS description,
          Phone           AS phone,
          Email           AS email,
          Address         AS address,
          Price           AS price,
          StartDay        AS startDay,
          EndDay          AS endDay,
          CONVERT(varchar(5), StartTime, 108) AS startTime,
          CONVERT(varchar(5), EndTime,   108) AS endTime,
          ImagePath       AS imagePath,
          CoverImagePath  AS coverImagePath,
          IsVerified      AS isVerified
        FROM tblGrowEquipments
        WHERE Id = @Id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "GrowEquipment not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching GrowEquipment:", err);
    res.status(500).json({ error: "Failed to fetch GrowEquipment", details: err.message });
  }
};

// ── Create new ────────────────────────────────────────────────────────
exports.createGrowEquipment = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4().toUpperCase();
    const {
      name, description, phone, email,
      address, price, startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    const imagePath = req.files?.image?.[0]?.filename   || null;
    const coverPath = req.files?.cover?.[0]?.filename   || null;
    const verified  = (isVerified === "true" || isVerified === true) ? 1 : 0;
    const priceVal  = parsePrice(price);

    await pool.request()
      .input("Id",            sql.UniqueIdentifier, id)
      .input("Name",          sql.NVarChar,         name)
      .input("Description",   sql.NVarChar,         description)
      .input("Phone",         sql.NVarChar,         phone)
      .input("Email",         sql.NVarChar,         email)
      .input("Address",       sql.NVarChar,         address)
      .input("Price",         sql.Decimal(18,2),    priceVal)
      .input("StartDay",      sql.NVarChar,         startDay)
      .input("EndDay",        sql.NVarChar,         endDay)
      .input("StartTime",     sql.VarChar(50),      `${startTime}:00`)
      .input("EndTime",       sql.VarChar(50),      `${endTime}:00`)
      .input("ImagePath",     sql.NVarChar,         imagePath)
      .input("CoverImagePath",sql.NVarChar,         coverPath)
      .input("IsVerified",    sql.Bit,              verified)
      .input("Lat",           sql.Decimal(9,6),     0)
      .input("Long",          sql.Decimal(9,6),     0)
      .query(`
        INSERT INTO tblGrowEquipments
          (Id, Name, Description, Phone, Email, Address, Price,
           StartDay, EndDay, StartTime, EndTime,
           ImagePath, CoverImagePath, IsVerified, Lat, Long)
        VALUES
          (@Id,@Name,@Description,@Phone,@Email,@Address,@Price,
           @StartDay,@EndDay,@StartTime,@EndTime,
           @ImagePath,@CoverImagePath,@IsVerified,@Lat,@Long)
      `);

    res.status(201).json({ success: true, growEquipmentId: id });
  } catch (err) {
    console.error("Error creating GrowEquipment:", err);
    res.status(500).json({ error: "Failed to create GrowEquipment", details: err.message });
  }
};

// ── Update existing ───────────────────────────────────────────────────
exports.updateGrowEquipment = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      name, description, phone, email,
      address, price, startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    // fetch old image filenames
    const oldRes = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`
        SELECT ImagePath AS oldImage, CoverImagePath AS oldCover
        FROM tblGrowEquipments
        WHERE Id = @Id
      `);
    const { oldImage, oldCover } = oldRes.recordset[0] || {};

    const newImage = req.files?.image?.[0]?.filename || null;
    const newCover = req.files?.cover?.[0]?.filename || null;

    // delete old files if replaced
    const tryUnlink = fn => {
      if (!fn) return;
      const p = path.join(IMAGE_DIR, fn);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch {}
      }
    };
    if (newImage && oldImage) tryUnlink(oldImage);
    if (newCover && oldCover) tryUnlink(oldCover);

    const verified = (isVerified === "true" || isVerified === true) ? 1 : 0;
    const priceVal = parsePrice(price);

    const reqQ = pool.request()
      .input("Id",            sql.UniqueIdentifier, id)
      .input("Name",          sql.NVarChar,         name)
      .input("Description",   sql.NVarChar,         description)
      .input("Phone",         sql.NVarChar,         phone)
      .input("Email",         sql.NVarChar,         email)
      .input("Address",       sql.NVarChar,         address)
      .input("Price",         sql.Decimal(18,2),    priceVal)
      .input("StartDay",      sql.NVarChar,         startDay)
      .input("EndDay",        sql.NVarChar,         endDay)
      .input("StartTime",     sql.VarChar(50),      `${startTime}:00`)
      .input("EndTime",       sql.VarChar(50),      `${endTime}:00`)
      .input("IsVerified",    sql.Bit,              verified);

    if (newImage) reqQ.input("ImagePath", sql.NVarChar, newImage);
    if (newCover) reqQ.input("CoverImagePath", sql.NVarChar, newCover);

    await reqQ.query(`
      UPDATE tblGrowEquipments
      SET
        Name           = @Name,
        Description    = @Description,
        Phone          = @Phone,
        Email          = @Email,
        Address        = @Address,
        Price          = @Price,
        StartDay       = @StartDay,
        EndDay         = @EndDay,
        StartTime      = @StartTime,
        EndTime        = @EndTime,
        ${newImage   ? "ImagePath       = @ImagePath," : ""}
        ${newCover   ? "CoverImagePath  = @CoverImagePath," : ""}
        IsVerified     = @IsVerified
      WHERE Id = @Id
    `);

    res.json({ message: "GrowEquipment updated successfully" });
  } catch (err) {
    console.error("Error updating GrowEquipment:", err);
    res.status(500).json({ error: "Failed to update GrowEquipment", details: err.message });
  }
};

// ── Delete ──────────────────────────────────────────────────────────────
exports.deleteGrowEquipment = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM tblGrowEquipments WHERE Id = @Id`);
    res.json({ message: "GrowEquipment deleted successfully" });
  } catch (err) {
    console.error("Error deleting GrowEquipment:", err);
    res.status(500).json({ error: "Failed to delete GrowEquipment", details: err.message });
  }
};
