/* backend/admin/Gallery/adminGalleryController.js
   ──────────────────────────────────────────────────────────────────
   Supports IsButton, ButtonLabel, ButtonLink (no other logic changed).
*/
const sql          = require("mssql");
const { v4: uuidv4 } = require("uuid");

/* helpers ------------------------------------------------------- */
function getPool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}
function parseJsonOrEmpty(str) {
  try { return JSON.parse(str); }
  catch { return []; }
}

/* ───────────────── LIST & GET ────────────────────────────────── */
exports.listGallery = async (req, res) => {
  try {
    const { recordset } = await getPool().request().query(`
      SELECT
        Id, Title, SubTitle, IsGrid, IsSlide,
        IsButton, ButtonLabel, ButtonLink,
        GridProductIds, SlideProductIds
      FROM tblGallery ORDER BY Title;
    `);

    res.json(
      recordset.map(r => ({
        id:              r.Id,
        title:           r.Title,
        subTitle:        r.SubTitle,
        isGrid:          !!r.IsGrid,
        isSlide:         !!r.IsSlide,
        isButton:        !!r.IsButton,
        buttonLabel:     r.ButtonLabel ?? "",
        buttonLink:      r.ButtonLink  ?? "",
        gridProductIds:  parseJsonOrEmpty(r.GridProductIds),
        slideProductIds: parseJsonOrEmpty(r.SlideProductIds),
      }))
    );
  } catch (err) {
    console.error("Gallery list error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id, Title, SubTitle, IsGrid, IsSlide,
          IsButton, ButtonLabel, ButtonLink,
          GridProductIds, SlideProductIds
        FROM tblGallery WHERE Id = @id;
      `);

    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    const r = recordset[0];
    res.json({
      id:              r.Id,
      title:           r.Title,
      subTitle:        r.SubTitle,
      isGrid:          !!r.IsGrid,
      isSlide:         !!r.IsSlide,
      isButton:        !!r.IsButton,
      buttonLabel:     r.ButtonLabel ?? "",
      buttonLink:      r.ButtonLink  ?? "",
      gridProductIds:  parseJsonOrEmpty(r.GridProductIds),
      slideProductIds: parseJsonOrEmpty(r.SlideProductIds),
    });
  } catch (err) {
    console.error("Get gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ───────────────── CREATE / UPDATE / DELETE ─────────────────── */
exports.createGallery = async (req, res) => {
  try {
    const id = uuidv4();
    const {
      title           = "",
      subTitle        = "",
      isGrid          = false,
      isSlide         = false,
      isButton        = false,
      buttonLabel     = "",
      buttonLink      = "",
      gridProductIds  = [],
      slideProductIds = [],
    } = req.body;

    await getPool().request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("title",           sql.NVarChar,         title.trim() || "(Ohne Titel)")
      .input("subTitle",        sql.NVarChar,         subTitle)
      .input("isGrid",          sql.Bit,              isGrid)
      .input("isSlide",         sql.Bit,              isSlide)
      .input("isButton",        sql.Bit,              isButton)
      .input("buttonLabel",     sql.NVarChar,         buttonLabel)
      .input("buttonLink",      sql.NVarChar,         buttonLink)
      .input("gridProductIds",  sql.NVarChar,         JSON.stringify(gridProductIds))
      .input("slideProductIds", sql.NVarChar,         JSON.stringify(slideProductIds))
      .query(`
        INSERT INTO tblGallery
          (Id, Title, SubTitle, IsGrid, IsSlide,
           IsButton, ButtonLabel, ButtonLink,
           GridProductIds, SlideProductIds)
        VALUES
          (@id, @title, @subTitle, @isGrid, @isSlide,
           @isButton, @buttonLabel, @buttonLink,
           @gridProductIds, @slideProductIds);
      `);

    res.status(201).json({ message: "Gallery created", id });
  } catch (err) {
    console.error("Create gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title       = "",
      subTitle    = "",
      isGrid      = false,
      isSlide     = false,
      isButton    = false,
      buttonLabel = "",
      buttonLink  = "",
    } = req.body;

    await getPool().request()
      .input("id",          sql.UniqueIdentifier, id)
      .input("title",       sql.NVarChar,         title.trim() || "(Ohne Titel)")
      .input("subTitle",    sql.NVarChar,         subTitle)
      .input("isGrid",      sql.Bit,              isGrid)
      .input("isSlide",     sql.Bit,              isSlide)
      .input("isButton",    sql.Bit,              isButton)
      .input("buttonLabel", sql.NVarChar,         buttonLabel)
      .input("buttonLink",  sql.NVarChar,         buttonLink)
      .query(`
        UPDATE tblGallery
        SET Title       = @title,
            SubTitle    = @subTitle,
            IsGrid      = @isGrid,
            IsSlide     = @isSlide,
            IsButton    = @isButton,
            ButtonLabel = @buttonLabel,
            ButtonLink  = @buttonLink
        WHERE Id = @id;
      `);

    res.json({ message: "Gallery updated" });
  } catch (err) {
    console.error("Update gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.deleteGallery = async (req, res) => {
  try {
    const { id } = req.params;
    await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM tblGallery WHERE Id = @id;`);
    res.json({ message: "Gallery deleted" });
  } catch (err) {
    console.error("Delete gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ── Grid / Slide handlers remain unchanged … */
