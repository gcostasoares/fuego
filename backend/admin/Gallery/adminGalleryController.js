/* backend/admin/Gallery/adminGalleryController.js
   ────────────────────────────────────────────────────────────────
   Now supports the new columns:

     IsButton   (bit, NOT NULL, default 0)
     ButtonLabel (nvarchar(128), NULL)
     ButtonLink  (nvarchar(1024), NULL)

   No other logic has changed.
*/
const sql          = require("mssql");
const { v4: uuidv4 } = require("uuid");

/* ───────── helpers ───────── */
function getPool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}
function parseJsonOrEmpty(str) {
  try { return JSON.parse(str); }
  catch { return []; }
}

/* ───────────────── LIST & GET ─────────────────────────────────── */

/** List all galleries */
exports.listGallery = async (req, res) => {
  try {
    const { recordset } = await getPool().request().query(`
      SELECT
        Id, Title, SubTitle, IsGrid, IsSlide,
        IsButton, ButtonLabel, ButtonLink,
        GridProductIds, SlideProductIds
      FROM tblGallery
      ORDER BY Title;
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

/** Get single gallery */
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
        FROM tblGallery
        WHERE Id = @id;
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

/* ───────────────── CREATE / UPDATE / DELETE ───────────────────── */

/** Create new gallery */
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

/** Update gallery */
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

/** Delete gallery */
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

/* ───────────────── GRID HELPERS ───────────────────────────────── */

/** List grid products */
exports.listGrid = async (req, res) => {
  try {
    const { id } = req.params;
    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT GridProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) return res.status(404).json({ error: "Gallery not found" });
    res.json(parseJsonOrEmpty(recordset[0].GridProductIds));
  } catch (err) {
    console.error("List grid products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Add product to grid */
exports.addGrid = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT GridProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) return res.status(404).json({ error: "Gallery not found" });

    const arr = parseJsonOrEmpty(recordset[0].GridProductIds);
    if (!arr.includes(productId)) arr.push(productId);

    await getPool().request()
      .input("id",             sql.UniqueIdentifier, id)
      .input("gridProductIds", sql.NVarChar, JSON.stringify(arr))
      .query(`UPDATE tblGallery SET GridProductIds = @gridProductIds WHERE Id = @id;`);

    res.status(201).json(arr);
  } catch (err) {
    console.error("Add grid product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Remove product from grid */
exports.removeGrid = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT GridProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) return res.status(404).json({ error: "Gallery not found" });

    const arr = parseJsonOrEmpty(recordset[0].GridProductIds)
      .filter(pid => pid !== productId);

    await getPool().request()
      .input("id",             sql.UniqueIdentifier, id)
      .input("gridProductIds", sql.NVarChar, JSON.stringify(arr))
      .query(`UPDATE tblGallery SET GridProductIds = @gridProductIds WHERE Id = @id;`);

    res.json(arr);
  } catch (err) {
    console.error("Remove grid product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Re-order grid products */
exports.orderGrid = async (req, res) => {
  try {
    const { id } = req.params;
    const { order: newOrder } = req.body;     // expects string[]

    await getPool().request()
      .input("id",             sql.UniqueIdentifier, id)
      .input("gridProductIds", sql.NVarChar, JSON.stringify(newOrder))
      .query(`UPDATE tblGallery SET GridProductIds = @gridProductIds WHERE Id = @id;`);

    res.json(newOrder);
  } catch (err) {
    console.error("Order grid error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ───────────────── SLIDE HELPERS ─────────────────────────────── */

/** List slide products */
exports.listSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT SlideProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) return res.status(404).json({ error: "Gallery not found" });
    res.json(parseJsonOrEmpty(recordset[0].SlideProductIds));
  } catch (err) {
    console.error("List slide products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Add product to slide */
exports.addSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;

    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT SlideProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) return res.status(404).json({ error: "Gallery not found" });

    const arr = parseJsonOrEmpty(recordset[0].SlideProductIds);
    if (!arr.includes(productId)) arr.push(productId);

    await getPool().request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("slideProductIds", sql.NVarChar, JSON.stringify(arr))
      .query(`UPDATE tblGallery SET SlideProductIds = @slideProductIds WHERE Id = @id;`);

    res.status(201).json(arr);
  } catch (err) {
    console.error("Add slide product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Remove product from slide */
exports.removeSlide = async (req, res) => {
  try {
    const { id, productId } = req.params;

    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT SlideProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) return res.status(404).json({ error: "Gallery not found" });

    const arr = parseJsonOrEmpty(recordset[0].SlideProductIds)
      .filter(pid => pid !== productId);

    await getPool().request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("slideProductIds", sql.NVarChar, JSON.stringify(arr))
      .query(`UPDATE tblGallery SET SlideProductIds = @slideProductIds WHERE Id = @id;`);

    res.json(arr);
  } catch (err) {
    console.error("Remove slide product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Re-order slide products */
exports.orderSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { order: newOrder } = req.body;   // expects string[]

    await getPool().request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("slideProductIds", sql.NVarChar, JSON.stringify(newOrder))
      .query(`UPDATE tblGallery SET SlideProductIds = @slideProductIds WHERE Id = @id;`);

    res.json(newOrder);
  } catch (err) {
    console.error("Order slide error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
