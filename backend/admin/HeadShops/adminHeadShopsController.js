// backend/controllers/adminHeadShopsController.js

const sql        = require("mssql");
const fs         = require("fs");
const path       = require("path");
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

const IMAGE_DIR = path.join(__dirname, "../../public/images/HeadShops");

// ── List (pagination) ─────────────────────────────────────────────────────
exports.getAllHeadShops = async (req, res) => {
  try {
    const pool = getPool();
    const pageNumber = parseInt(req.query.pageNumber,10) || 1;
    const pageSize   = parseInt(req.query.pageSize,10)   || 10;
    const offset     = (pageNumber - 1) * pageSize;

    const countResult = await pool.request()
      .query(`SELECT COUNT(*) AS total FROM tblHeadShops`);

    const dataResult = await pool.request()
      .input("offset",   sql.Int, offset)
      .input("pageSize", sql.Int, pageSize)
      .query(`
        SELECT
          Id, Name, Description, ProfileUrl, Phone, Email, Address,
          Price, StartDay, EndDay,
          CONVERT(varchar(5), StartTime, 108) AS startTime,
          CONVERT(varchar(5), EndTime,   108) AS endTime,
          ImagePath, CoverImagePath, IsVerified
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
    console.error(err);
    res.status(500).json({ error:"Failed to fetch head shops", details: err.message });
  }
};

// ── Single item ────────────────────────────────────────────────────────────
exports.getHeadShopById = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const result = await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id, Name, Description, ProfileUrl, Phone, Email, Address,
          Price, StartDay, EndDay,
          CONVERT(varchar(5), StartTime, 108) AS startTime,
          CONVERT(varchar(5), EndTime,   108) AS endTime,
          ImagePath, CoverImagePath, IsVerified
        FROM tblHeadShops
        WHERE Id = @Id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error:"Head Shop not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Failed to fetch head shop", details: err.message });
  }
};

// ── Create ────────────────────────────────────────────────────────────────
exports.createHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4().toUpperCase();
    const {
      name, description, profileUrl, phone, email,
      address, price, startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    const imagePath   = req.files?.image?.[0]?.filename   || null;
    const coverPath   = req.files?.cover?.[0]?.filename   || null;
    const verifiedBit = (isVerified==="true") ? 1 : 0;
    const priceVal    = parsePrice(price);

    await pool.request()
      .input("Id",             sql.UniqueIdentifier, id)
      .input("Name",           sql.NVarChar,         name)
      .input("Description",    sql.NVarChar,         description)
      .input("ProfileUrl",     sql.NVarChar,         profileUrl)
      .input("Phone",          sql.NVarChar,         phone)
      .input("Email",          sql.NVarChar,         email)
      .input("Address",        sql.NVarChar,         address)
      .input("Price",          sql.Decimal(18,2),    priceVal)
      .input("StartDay",       sql.NVarChar,         startDay)
      .input("EndDay",         sql.NVarChar,         endDay)
      // ← using sql.Time here fixes the conversion
      .input("StartTime",      sql.Time,             startTime)
      .input("EndTime",        sql.Time,             endTime)
      .input("ImagePath",      sql.NVarChar,         imagePath)
      .input("CoverImagePath", sql.NVarChar,         coverPath)
      .input("IsVerified",     sql.Bit,              verifiedBit)
      .input("Lat",            sql.Decimal(9,6),     0)
      .input("Long",           sql.Decimal(9,6),     0)
      .query(`
        INSERT INTO tblHeadShops
          (Id, Name, Description, ProfileUrl, Phone, Email, Address, Price,
           StartDay, EndDay, StartTime, EndTime,
           ImagePath, CoverImagePath, IsVerified, Lat, Long)
        VALUES
          (@Id,@Name,@Description,@ProfileUrl,@Phone,@Email,@Address,@Price,
           @StartDay,@EndDay,@StartTime,@EndTime,
           @ImagePath,@CoverImagePath,@IsVerified,@Lat,@Long)
      `);

    res.status(201).json({ success:true, headShopId:id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Server error", details: err.message });
  }
};

// ── Update ────────────────────────────────────────────────────────────────
exports.updateHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    const {
      name, description, profileUrl, phone, email,
      address, price, startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    // fetch old image filenames
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

    const tryUnlink = fn => {
      if (!fn) return;
      const p = path.join(IMAGE_DIR, fn);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p) } catch {}
      }
    };
    if (newImage && oldImage) tryUnlink(oldImage);
    if (newCover && oldCover) tryUnlink(oldCover);

    const verifiedBit = (isVerified==="true") ? 1 : 0;
    const priceVal    = parsePrice(price);

    const reqQ = pool.request()
      .input("Id",          sql.UniqueIdentifier, id)
      .input("Name",        sql.NVarChar,         name)
      .input("Description", sql.NVarChar,         description)
      .input("ProfileUrl",  sql.NVarChar,         profileUrl)
      .input("Phone",       sql.NVarChar,         phone)
      .input("Email",       sql.NVarChar,         email)
      .input("Address",     sql.NVarChar,         address)
      .input("Price",       sql.Decimal(18,2),    priceVal)
      .input("StartDay",    sql.NVarChar,         startDay)
      .input("EndDay",      sql.NVarChar,         endDay)
      // ← same fix here
      .input("StartTime",   sql.Time,             startTime)
      .input("EndTime",     sql.Time,             endTime)
      .input("IsVerified",  sql.Bit,              verifiedBit);

    if (newImage) reqQ.input("ImagePath", sql.NVarChar, newImage);
    if (newCover) reqQ.input("CoverImagePath", sql.NVarChar, newCover);

    await reqQ.query(`
      UPDATE tblHeadShops
      SET
        Name           = @Name,
        Description    = @Description,
        ProfileUrl     = @ProfileUrl,
        Phone          = @Phone,
        Email          = @Email,
        Address        = @Address,
        Price          = @Price,
        StartDay       = @StartDay,
        EndDay         = @EndDay,
        StartTime      = @StartTime,
        EndTime        = @EndTime,
        ${newImage   ? "ImagePath       = @ImagePath,"   : ""}
        ${newCover   ? "CoverImagePath  = @CoverImagePath," : ""}
        IsVerified     = @IsVerified
      WHERE Id = @Id
    `);

    res.json({ message: "Head Shop updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Failed to update head shop", details: err.message });
  }
};

// ── Delete ────────────────────────────────────────────────────────────────
exports.deleteHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;
    await pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM tblHeadShops WHERE Id = @Id`);
    res.json({ message: "Head Shop deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error:"Failed to delete head shop", details: err.message });
  }
};
