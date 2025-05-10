// backend/admin/Doctors/adminDoctorsController.js

const sql        = require("mssql");
const fs         = require("fs");
const path       = require("path");
const { v4: uuidv4 } = require("uuid");

// DB config is inherited from your global pool in server.js, so here we just use that pool
// (you could also require pool from a shared module if you prefer)

const TABLE         = "tblDoctors";
const IMAGE_DIR     = path.join(__dirname, "../../public/images/Doctors");
const DEFAULT_COVER = "437b7272-6cd2-4b9e-b6ba-50e713419ad5.png";

/**
 * Turn "42,33" or "59.2" → 42.33  (two‐decimal truncation)
 */
function parsePrice(input) {
  const str = (input ?? "").toString().trim().replace(/,/g, ".");
  const num = parseFloat(str);
  if (isNaN(num)) return 0;
  return Math.floor(num * 100) / 100;
}

/**
 * Given a "HH:mm" string, return a JS Date on 1970-01-01 at that time.
 * Throws if the string is malformed.
 */
function timeStringToDate(hhmm) {
  // ensure exactly "HH:mm"
  if (!/^\d{2}:\d{2}$/.test(hhmm)) {
    throw new Error("Invalid time format: " + hhmm);
  }
  // construct an ISO‐8601 timestamp
  const iso = `1970-01-01T${hhmm}:00.000Z`;
  const d = new Date(iso);
  if (isNaN(d.getTime())) {
    throw new Error("Invalid time value: " + iso);
  }
  return d;
}

// ── GET /doctors ─────────────────────────────────────────────────────────────
exports.getDoctors = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 50 } = req.query;
    const offset = (pageNumber - 1) * pageSize;

    // count total
    const countQ = await global.pool.request()
      .query(`SELECT COUNT(*) AS total FROM ${TABLE}`);

    // fetch page
    const dataQ = await global.pool.request()
      .query(`
        SELECT
          Id           AS id,
          Name         AS name,
          Description,
          ProfileUrl   AS profileUrl,
          Phone,
          IsVerified,
          Email,
          Address,
          Lat, Long,
          Price,
          StartDay,
          EndDay,
          StartTime,
          EndTime,
          ImagePath,
          CoverImagePath
        FROM ${TABLE}
        ORDER BY Name
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY
      `);

    res.json({
      doctors:    dataQ.recordset,
      totalCount: countQ.recordset[0].total
    });
  } catch (err) {
    console.error("getDoctors error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /doctors/:id ─────────────────────────────────────────────────────────
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id           AS id,
          Name         AS name,
          Description,
          ProfileUrl   AS profileUrl,
          Phone,
          IsVerified,
          Email,
          Address,
          Lat, Long,
          Price,
          StartDay,
          EndDay,
          StartTime,
          EndTime,
          ImagePath,
          CoverImagePath
        FROM ${TABLE}
        WHERE Id = @id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Doctor not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("getDoctorById error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /doctors ────────────────────────────────────────────────────────────
exports.createDoctor = async (req, res) => {
  try {
    const {
      name, description, profileUrl,
      phone, isVerified, email, address,
      price, startDay, endDay, startTime,
      endTime, coverImageUrl
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;
    const id        = uuidv4();
    const priceVal  = parsePrice(price);
    const st        = timeStringToDate(startTime);
    const et        = timeStringToDate(endTime);

    await global.pool.request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("name",            sql.NVarChar,         name)
      .input("description",     sql.NVarChar,         description)
      .input("profileUrl",      sql.NVarChar,         profileUrl)
      .input("phone",           sql.NVarChar,         phone)
      .input("isVerified",      sql.Bit,              isVerified === true || isVerified === "true")
      .input("email",           sql.NVarChar,         email)
      .input("address",         sql.NVarChar,         address)
      .input("lat",             sql.Decimal(9,6),     0)
      .input("long",            sql.Decimal(9,6),     0)
      .input("price",           sql.Decimal(18,2),    priceVal)
      .input("startDay",        sql.NVarChar,         startDay)
      .input("startTime",       sql.DateTime,         st)
      .input("endDay",          sql.NVarChar,         endDay)
      .input("endTime",         sql.DateTime,         et)
      .input("imagePath",       sql.NVarChar,         imagePath)
      .input("coverImagePath",  sql.NVarChar,         coverImageUrl || DEFAULT_COVER)
      .query(`
        INSERT INTO ${TABLE} (
          Id, Name, Description, ProfileUrl, Phone, IsVerified, Email, Address,
          Lat, Long, Price, StartDay, StartTime, EndDay, EndTime,
          ImagePath, CoverImagePath
        ) VALUES (
          @id,@name,@description,@profileUrl,@phone,@isVerified,@email,@address,
          @lat,@long,@price,@startDay,@startTime,@endDay,@endTime,
          @imagePath,@coverImagePath
        )
      `);

    res.status(201).json({ id });
  } catch (err) {
    console.error("createDoctor error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /doctors/:id ─────────────────────────────────────────────────────────
exports.updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      profileUrl: bodyProfile,
      coverImageUrl: bodyCover,
      removeProfile, removeCover,
      name, description, phone, isVerified,
      email, address, price,
      startDay, endDay, startTime, endTime
    } = req.body;

    // fetch old filenames
    const old = await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT ImagePath AS oldProfile, CoverImagePath AS oldCover
        FROM ${TABLE}
        WHERE Id = @id
      `);
    const { oldProfile, oldCover } = old.recordset[0] || {};
    const newProfileFile = req.file ? req.file.filename : null;

    // delete old files if replaced/removed
    const tryUnlink = fn => {
      if (!fn) return;
      const full = path.join(IMAGE_DIR, fn);
      if (fs.existsSync(full)) {
        try { fs.unlinkSync(full) } catch (_) {}
      }
    };
    if (removeProfile === "true" || newProfileFile) tryUnlink(oldProfile);
    if (removeCover === "true" && oldCover && oldCover !== DEFAULT_COVER) tryUnlink(oldCover);

    const priceVal = parsePrice(price);
    const st       = timeStringToDate(startTime);
    const et       = timeStringToDate(endTime);

    const finalImage = newProfileFile
      ? newProfileFile
      : (removeProfile === "true" ? null : bodyProfile);
    const finalCover = bodyCover || (removeCover === "true" ? null : bodyCover);

    await global.pool.request()
      .input("id",              sql.UniqueIdentifier,  id)
      .input("name",            sql.NVarChar,          name)
      .input("description",     sql.NVarChar,          description)
      .input("phone",           sql.NVarChar,          phone)
      .input("isVerified",      sql.Bit,               isVerified === true || isVerified === "true")
      .input("email",           sql.NVarChar,          email)
      .input("address",         sql.NVarChar,          address)
      .input("lat",             sql.Decimal(9,6),      0)
      .input("long",            sql.Decimal(9,6),      0)
      .input("price",           sql.Decimal(18,2),     priceVal)
      .input("startDay",        sql.NVarChar,          startDay)
      .input("startTime",       sql.DateTime,          st)
      .input("endDay",          sql.NVarChar,          endDay)
      .input("endTime",         sql.DateTime,          et)
      .input("imagePath",       sql.NVarChar,          finalImage)
      .input("coverImagePath",  sql.NVarChar,          finalCover)
      .query(`
        UPDATE ${TABLE}
        SET
          Name            = @name,
          Description     = @description,
          Phone           = @phone,
          IsVerified      = @isVerified,
          Email           = @email,
          Address         = @address,
          Lat             = @lat,
          Long            = @long,
          Price           = @price,
          StartDay        = @startDay,
          StartTime       = @startTime,
          EndDay          = @endDay,
          EndTime         = @endTime,
          ImagePath       = @imagePath,
          CoverImagePath  = @coverImagePath
        WHERE Id = @id
      `);

    res.json({ id });
  } catch (err) {
    console.error("updateDoctor error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /doctors/:id ──────────────────────────────────────────────────────
exports.deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    // fetch old filenames
    const old = await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT ImagePath AS profile, CoverImagePath AS cover
        FROM ${TABLE}
        WHERE Id = @id
      `);
    const { profile, cover } = old.recordset[0] || {};

    [profile, cover].forEach(fn => {
      if (fn && fn !== DEFAULT_COVER) {
        const p = path.join(IMAGE_DIR, fn);
        if (fs.existsSync(p)) {
          try { fs.unlinkSync(p) } catch (_) {}
        }
      }
    });

    await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM ${TABLE} WHERE Id = @id`);

    res.sendStatus(204);
  } catch (err) {
    console.error("deleteDoctor error:", err);
    res.status(500).json({ error: err.message });
  }
};
