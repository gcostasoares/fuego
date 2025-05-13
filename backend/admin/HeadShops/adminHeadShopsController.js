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

// Helper: ensure "HH:mm" → "HH:mm:00", leave "HH:mm:ss" untouched
function normalizeTime(t) {
  if (typeof t !== "string") return null;
  // already includes seconds?
  if (/^[0-2]\d:[0-5]\d:[0-5]\d$/.test(t)) return t;
  // if it's "HH:mm"
  if (/^[0-2]\d:[0-5]\d$/.test(t)) return t + ":00";
  // otherwise invalid
  return null;
}

// ── List with pagination ─────────────────────────────────────────────────────
exports.getAllHeadShops = async (req, res) => {
  try {
    const pool       = getPool();
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
          Id              AS id,
          Name            AS name,
          Description     AS description,
          ProfileUrl      AS profileUrl,
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
    console.error("Error fetching Head Shops:", err);
    res.status(500).json({ error:"Failed to fetch head shops", details: err.message });
  }
};

// ── Get single shop by ID ────────────────────────────────────────────────────
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
          ProfileUrl      AS profileUrl,
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
      return res.status(404).json({ error:"Head Shop not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching head shop:", err);
    res.status(500).json({ error:"Failed to fetch head shop", details: err.message });
  }
};

// ── Create a new Head Shop ──────────────────────────────────────────────────
exports.createHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4().toUpperCase();

    const {
      name, description, profileUrl,
      phone, email, address, price,
      startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    // normalize the times
    const st = normalizeTime(startTime);
    const et = normalizeTime(endTime);
    if (!st || !et) {
      return res.status(400).json({ error:"Invalid time format" });
    }

    const imagePath   = req.files?.image?.[0]?.filename   || null;
    const coverPath   = req.files?.cover?.[0]?.filename   || null;
    const verifiedBit = (isVerified === "true") ? 1 : 0;
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
      .input("StartTime",      sql.Time,             st)
      .input("EndTime",        sql.Time,             et)
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
    console.error("Error creating head shop:", err);
    res.status(500).json({ error:"Server error", details: err.message });
  }
};

// ── Update an existing Head Shop ──────────────────────────────────────────
exports.updateHeadShop = async (req, res) => {
  try {
    const pool = getPool();
    const { id } = req.params;

    const {
      name, description, profileUrl,
      phone, email, address, price,
      startDay, endDay,
      startTime, endTime, isVerified
    } = req.body;

    // normalize times again
    const st = normalizeTime(startTime);
    const et = normalizeTime(endTime);
    if (!st || !et) {
      return res.status(400).json({ error:"Invalid time format" });
    }

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

    // delete old files if replaced
    const tryUnlink = fn => {
      if (!fn) return;
      const p = path.join(IMAGE_DIR, fn);
      if (fs.existsSync(p)) {
        try { fs.unlinkSync(p) } catch {}
      }
    };
    if (newImage && oldImage) tryUnlink(oldImage);
    if (newCover && oldCover) tryUnlink(oldCover);

    const verifiedBit = (isVerified === "true") ? 1 : 0;
    const priceVal    = parsePrice(price);

    const reqQ = pool.request()
      .input("Id",          sql.UniqueIdentifier,  id)
      .input("Name",        sql.NVarChar,          name)
      .input("Description", sql.NVarChar,          description)
      .input("ProfileUrl",  sql.NVarChar,          profileUrl)
      .input("Phone",       sql.NVarChar,          phone)
      .input("Email",       sql.NVarChar,          email)
      .input("Address",     sql.NVarChar,          address)
      .input("Price",       sql.Decimal(18,2),     priceVal)
      .input("StartDay",    sql.NVarChar,          startDay)
      .input("EndDay",      sql.NVarChar,          endDay)
      .input("StartTime",   sql.Time,              st)
      .input("EndTime",     sql.Time,              et)
      .input("IsVerified",  sql.Bit,               verifiedBit);

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
    console.error("Error updating head shop:", err);
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
    console.error("Error deleting head shop:", err);
    res.status(500).json({ error:"Failed to delete head shop", details: err.message });
  }
};
