const sql       = require("mssql");
const fs        = require("fs");
const path      = require("path");
const { v4: uuidv4 } = require("uuid");

// Normalize user-entered price to a two-decimal number
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

// Two levels up from here: backend/public/images/HeadShops
const IMAGE_DIR = path.join(__dirname, "../../public/images/HeadShops");

// ── List with pagination ────────────────────────────────────────────────
exports.getAllHeadShops = async (req, res) => {
  try {
    const pool       = getPool();
    const pageNumber = parseInt(req.query.pageNumber, 10) || 1;
    const pageSize   = parseInt(req.query.pageSize,   10) || 10;
    const offset     = (pageNumber - 1) * pageSize;

    const countResult = await pool.request()
      .query(`SELECT COUNT(*) AS total FROM tblHeadShops`);

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
        FROM tblHeadShops
        ORDER BY Name
        OFFSET @offset ROWS
        FETCH NEXT @pageSize ROWS ONLY
      `);

    res.json({
      headShops:   dataResult.recordset,
      totalCount:  countResult.recordset[0].total
    });
  } catch (err) {
    console.error("Error fetching HeadShops:", err);
    res.status(500).json({ error: "Failed to fetch HeadShops", details: err.message });
  }
};

// ── Get single shop by ID ───────────────────────────────────────────────
exports.getHeadShopById = async (req, res) => {
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
        FROM tblHeadShops
        WHERE Id = @Id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "HeadShop not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching HeadShop:", err);
    res.status(500).json({ error: "Failed to fetch HeadShop", details: err.message });
  }
};

// ── Create a new HeadShop ───────────────────────────────────────────────
exports.createHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4().toUpperCase();
    const {
      name, description, phone, email,
      address, price, startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    const imagePath   = req.files?.image?.[0]?.filename   || null;
    const coverPath   = req.files?.cover?.[0]?.filename   || null;
    const verifiedBit = (isVerified === "true" || isVerified === "Verified") ? 1 : 0;
    const priceVal    = parsePrice(price);

    await pool.request()
      .input("Id",             sql.UniqueIdentifier, id)
      .input("Name",           sql.NVarChar,         name)
      .input("Description",    sql.NVarChar,         description)
      .input("Phone",          sql.NVarChar,         phone)
      .input("Email",          sql.NVarChar,         email)
      .input("Address",        sql.NVarChar,         address)
      .input("Price",          sql.Decimal(18,2),    priceVal)
      .input("StartDay",       sql.NVarChar,         startDay)
      .input("EndDay",         sql.NVarChar,         endDay)
      .input("StartTime",      sql.VarChar(50),      `${startTime}:00`)
      .input("EndTime",        sql.VarChar(50),      `${endTime}:00`)
      .input("ImagePath",      sql.NVarChar,         imagePath)
      .input("CoverImagePath", sql.NVarChar,         coverPath)
      .input("IsVerified",     sql.Bit,              verifiedBit)
      .input("Lat",            sql.Decimal(9,6),     0)
      .input("Long",           sql.Decimal(9,6),     0)
      .query(`
        INSERT INTO tblHeadShops
          (Id, Name, Description, Phone, Email, Address, Price,
           StartDay, EndDay, StartTime, EndTime,
           ImagePath, CoverImagePath, IsVerified, Lat, Long)
        VALUES
          (@Id,@Name,@Description,@Phone,@Email,@Address,@Price,
           @StartDay,@EndDay,@StartTime,@EndTime,
           @ImagePath,@CoverImagePath,@IsVerified,@Lat,@Long)
      `);

    res.status(201).json({ success: true, headShopId: id });
  } catch (err) {
    console.error("Error creating HeadShop:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// ── Update an existing HeadShop ────────────────────────────────────────
exports.updateHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      name, description, phone, email,
      address, price, startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    // Fetch old image filenames
    const oldRes = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`
        SELECT ImagePath AS oldImage, CoverImagePath AS oldCover
        FROM tblHeadShops
        WHERE Id = @Id
      `);
    const { oldImage, oldCover } = oldRes.recordset[0] || {};

    const newImage = req.files?.image?.[0]?.filename || null;
    const newCover = req.files?.cover?.[0]?.filename || null;

    // Helper to unlink old files
    const tryUnlink = fn => {
      if (!fn) return;
      const p = path.join(IMAGE_DIR, fn);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p); } catch {}
      }
    };
    if (newImage && oldImage) tryUnlink(oldImage);
    if (newCover && oldCover) tryUnlink(oldCover);

    const verifiedBit = (isVerified === "true" || isVerified === "Verified") ? 1 : 0;
    const priceVal    = parsePrice(price);

    const reqQ = pool.request()
      .input("Id",          sql.UniqueIdentifier,  id)
      .input("Name",        sql.NVarChar,          name)
      .input("Description", sql.NVarChar,          description)
      .input("Phone",       sql.NVarChar,          phone)
      .input("Email",       sql.NVarChar,          email)
      .input("Address",     sql.NVarChar,          address)
      .input("Price",       sql.Decimal(18,2),     priceVal)
      .input("StartDay",    sql.NVarChar,          startDay)
      .input("EndDay",      sql.NVarChar,          endDay)
      .input("StartTime",   sql.VarChar(50),       `${startTime}:00`)
      .input("EndTime",     sql.VarChar(50),       `${endTime}:00`)
      .input("IsVerified",  sql.Bit,               verifiedBit);

    if (newImage) reqQ.input("ImagePath",      sql.NVarChar, newImage);
    if (newCover) reqQ.input("CoverImagePath", sql.NVarChar, newCover);

    await reqQ.query(`
      UPDATE tblHeadShops
      SET
        Name            = @Name,
        Description     = @Description,
        Phone           = @Phone,
        Email           = @Email,
        Address         = @Address,
        Price           = @Price,
        StartDay        = @StartDay,
        EndDay          = @EndDay,
        StartTime       = @StartTime,
        EndTime         = @EndTime,
        ${newImage   ? "ImagePath       = @ImagePath," : ""}
        ${newCover   ? "CoverImagePath  = @CoverImagePath," : ""}
        IsVerified      = @IsVerified
      WHERE Id = @Id
    `);

    res.json({ message: "HeadShop updated successfully" });
  } catch (err) {
    console.error("Error updating HeadShop:", err);
    res.status(500).json({ error: "Failed to update HeadShop", details: err.message });
  }
};

// ── Delete ─────────────────────────────────────────────────────────────
exports.deleteHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM tblHeadShops WHERE Id = @Id`);
    res.json({ message: "HeadShop deleted successfully" });
  } catch (err) {
    console.error("Error deleting HeadShop:", err);
    res.status(500).json({ error: "Failed to delete HeadShop", details: err.message });
  }
};
