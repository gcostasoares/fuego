// backend/admin/Pharmacies/adminPharmaciesController.js

const sql        = require("mssql");
const path       = require("path");
const { v4: uuidv4 } = require("uuid");

// Multer already writes uploaded files into public/images/Pharmacy
const IMAGE_DIR     = path.join(__dirname, "../../public/images/Pharmacy");
const DEFAULT_COVER = "656821fa-72e8-472e-a885-afa1132f46f7.png";

// Format SQL DATETIME or TIME into "HH:mm"
function timeToHHMM(value) {
  if (!value) return "00:00";
  const d = new Date(value);
  const h = String(d.getUTCHours()).padStart(2, "0");
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

// ── GET /Pharmacies ─────────────────────────────────────────────────────────────
exports.getAllPharmacies = async (req, res) => {
  try {
    const { pageNumber = 1, pageSize = 50 } = req.query;
    const offset = (pageNumber - 1) * pageSize;
    const pool   = global.pool;

    const countQ = await pool.request()
      .query(`SELECT COUNT(*) AS total FROM tblPharmacies`);

    const dataQ = await pool.request()
      .query(`
        SELECT
          Id             AS id,
          Name           AS name,
          Description    AS description,
          ProfileUrl     AS profileUrl,
          Phone          AS phone,
          IsVerified     AS isVerified,
          Email          AS email,
          Address        AS address,
          Lat            AS lat,
          Long           AS long,
          Price          AS price,
          StartDay       AS startDay,
          EndDay         AS endDay,
          StartTime      AS startTime,
          EndTime        AS endTime,
          ImagePath      AS imagePath,
          CoverImagePath AS coverImagePath
        FROM tblPharmacies
        ORDER BY Name
        OFFSET ${offset} ROWS
        FETCH NEXT ${pageSize} ROWS ONLY
      `);

    const pharmacies = dataQ.recordset.map(p => ({
      ...p,
      startTime:      timeToHHMM(p.startTime),
      endTime:        timeToHHMM(p.endTime),
      coverImagePath: p.coverImagePath || DEFAULT_COVER
    }));

    res.json({
      pharmacies,
      totalCount: countQ.recordset[0].total
    });
  } catch (err) {
    console.error("getAllPharmacies error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── GET /Pharmacies/:id ──────────────────────────────────────────────────────────
exports.getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool   = global.pool;

    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id             AS id,
          Name           AS name,
          Description    AS description,
          ProfileUrl     AS profileUrl,
          Phone          AS phone,
          IsVerified     AS isVerified,
          Email          AS email,
          Address        AS address,
          Lat            AS lat,
          Long           AS long,
          Price          AS price,
          StartDay       AS startDay,
          EndDay         AS endDay,
          StartTime      AS startTime,
          EndTime        AS endTime,
          ImagePath      AS imagePath,
          CoverImagePath AS coverImagePath
        FROM tblPharmacies
        WHERE Id = @id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }
    const p = result.recordset[0];
    res.json({
      ...p,
      startTime:      timeToHHMM(p.startTime),
      endTime:        timeToHHMM(p.endTime),
      coverImagePath: p.coverImagePath || DEFAULT_COVER
    });
  } catch (err) {
    console.error("getPharmacyById error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── POST /Pharmacies ────────────────────────────────────────────────────────────
exports.createPharmacy = async (req, res) => {
  try {
    const {
      name, description, phone, email, website, address,
      startDay, endDay, startTime, endTime,
      imagePath, coverImagePath, isVerified
    } = req.body;

    const newId = uuidv4();
    const bit   = isVerified === true || isVerified === "true";

    await global.pool.request()
      .input("Id",             sql.UniqueIdentifier, newId)
      .input("Name",           sql.NVarChar,         name)
      .input("Description",    sql.NVarChar,         description)
      .input("ProfileUrl",     sql.NVarChar,         website)
      .input("Phone",          sql.NVarChar,         phone)
      .input("IsVerified",     sql.Bit,              bit)
      .input("Email",          sql.NVarChar,         email)
      .input("Address",        sql.NVarChar,         address)
      .input("Price",          sql.Decimal(18,2),    0)
      .input("StartDay",       sql.NVarChar,         startDay)
      .input("EndDay",         sql.NVarChar,         endDay)
      .input("StartTime",      sql.NVarChar,         startTime)
      .input("EndTime",        sql.NVarChar,         endTime)
      .input("Lat",            sql.Decimal(9,6),     0)
      .input("Long",           sql.Decimal(9,6),     0)
      .input("ImagePath",      sql.NVarChar,         imagePath)
      .input("CoverImagePath", sql.NVarChar,         coverImagePath || DEFAULT_COVER)
      .query(`
        INSERT INTO tblPharmacies
          (Id,Name,Description,ProfileUrl,Phone,IsVerified,Email,Address,
           Price,StartDay,EndDay,StartTime,EndTime,
           Lat,Long,ImagePath,CoverImagePath)
        VALUES
          (@Id,@Name,@Description,@ProfileUrl,@Phone,@IsVerified,@Email,@Address,
           @Price,@StartDay,@EndDay,@StartTime,@EndTime,
           @Lat,@Long,@ImagePath,@CoverImagePath)
      `);

    res.status(201).json({ id: newId });
  } catch (err) {
    console.error("createPharmacy error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── PUT /Pharmacies/:id ─────────────────────────────────────────────────────────
exports.updatePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, description, phone, email, website, address,
      startDay, endDay, startTime, endTime,
      imagePath, coverImagePath, isVerified
    } = req.body;

    const bit = isVerified === true || isVerified === "true";

    await global.pool.request()
      .input("Id",             sql.UniqueIdentifier, id)
      .input("Name",           sql.NVarChar,         name)
      .input("Description",    sql.NVarChar,         description)
      .input("ProfileUrl",     sql.NVarChar,         website)
      .input("Phone",          sql.NVarChar,         phone)
      .input("IsVerified",     sql.Bit,              bit)
      .input("Email",          sql.NVarChar,         email)
      .input("Address",        sql.NVarChar,         address)
      .input("Price",          sql.Decimal(18,2),    0)
      .input("StartDay",       sql.NVarChar,         startDay)
      .input("EndDay",         sql.NVarChar,         endDay)
      .input("StartTime",      sql.NVarChar,         startTime)
      .input("EndTime",        sql.NVarChar,         endTime)
      // leave existing Lat/Long untouched
      .input("ImagePath",      sql.NVarChar,         imagePath)
      .input("CoverImagePath", sql.NVarChar,         coverImagePath || DEFAULT_COVER)
      .query(`
        UPDATE tblPharmacies
        SET
          Name           = @Name,
          Description    = @Description,
          ProfileUrl     = @ProfileUrl,
          Phone          = @Phone,
          IsVerified     = @IsVerified,
          Email          = @Email,
          Address        = @Address,
          Price          = @Price,
          StartDay       = @StartDay,
          EndDay         = @EndDay,
          StartTime      = @StartTime,
          EndTime        = @EndTime,
          ImagePath      = @ImagePath,
          CoverImagePath = @CoverImagePath
        WHERE Id = @Id
      `);

    res.json({ id });
  } catch (err) {
    console.error("updatePharmacy error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ── DELETE /Pharmacies/:id ──────────────────────────────────────────────────────
exports.deletePharmacy = async (req, res) => {
  try {
    const { id } = req.params;
    await global.pool.request()
      .input("Id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM tblPharmacies WHERE Id = @Id`);
    res.sendStatus(204);
  } catch (err) {
    console.error("deletePharmacy error:", err);
    res.status(500).json({ error: err.message });
  }
};
