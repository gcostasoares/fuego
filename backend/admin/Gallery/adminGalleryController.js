// backend/admin/Gallery/adminGalleryController.js
const sql        = require("mssql");
const { v4: uuidv4 } = require("uuid");

/** Helper to get the live pool. */
function getPool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}

/** Safely parse a JSON column (NVARCHAR). */
function parseJsonOrEmpty(str) {
  try { return JSON.parse(str); }
  catch { return []; }
}

/** ─── LIST & GET ─────────────────────────────────────────────────────────────── */

/** List all galleries */
exports.listGallery = async (req, res) => {
  try {
    const pool = getPool();
    const { recordset } = await pool.request().query(`
      SELECT Id, Title, SubTitle, IsGrid, IsSlide, GridProductIds, SlideProductIds
      FROM tblGallery
      ORDER BY Title;
    `);

    const rows = recordset.map(r => ({
      id:              r.Id,
      title:           r.Title,
      subTitle:        r.SubTitle,
      isGrid:          !!r.IsGrid,
      isSlide:         !!r.IsSlide,
      gridProductIds:  parseJsonOrEmpty(r.GridProductIds),
      slideProductIds: parseJsonOrEmpty(r.SlideProductIds),
    }));

    res.json(rows);
  } catch (err) {
    console.error("Gallery list error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Get one gallery by ID */
exports.getGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const pool   = getPool();
    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT Id, Title, SubTitle, IsGrid, IsSlide, GridProductIds, SlideProductIds
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
      gridProductIds:  parseJsonOrEmpty(r.GridProductIds),
      slideProductIds: parseJsonOrEmpty(r.SlideProductIds),
    });
  } catch (err) {
    console.error("Get gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** ─── CREATE / UPDATE / DELETE ─────────────────────────────────────────────── */

/** Create a new gallery */
exports.createGallery = async (req, res) => {
  try {
    const pool = getPool();
    const id   = uuidv4();
    const {
      title = "",
      subTitle = "",
      isGrid = false,
      isSlide = false,
      gridProductIds = [],
      slideProductIds = []
    } = req.body;

    await pool.request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("title",           sql.NVarChar,         title.trim() || "(Ohne Titel)")
      .input("subTitle",        sql.NVarChar,         subTitle)
      .input("isGrid",          sql.Bit,              isGrid)
      .input("isSlide",         sql.Bit,              isSlide)
      .input("gridProductIds",  sql.NVarChar,         JSON.stringify(gridProductIds))
      .input("slideProductIds", sql.NVarChar,         JSON.stringify(slideProductIds))
      .query(`
        INSERT INTO tblGallery
          (Id, Title, SubTitle, IsGrid, IsSlide, GridProductIds, SlideProductIds)
        VALUES
          (@id, @title, @subTitle, @isGrid, @isSlide, @gridProductIds, @slideProductIds);
      `);

    res.status(201).json({ message: "Gallery created", id });
  } catch (err) {
    console.error("Create gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Update gallery metadata (title/subTitle/flags) */
exports.updateGallery = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title = "",
      subTitle = "",
      isGrid = false,
      isSlide = false
    } = req.body;

    await getPool().request()
      .input("id",       sql.UniqueIdentifier, id)
      .input("title",    sql.NVarChar,         title.trim() || "(Ohne Titel)")
      .input("subTitle", sql.NVarChar,         subTitle)
      .input("isGrid",   sql.Bit,              isGrid)
      .input("isSlide",  sql.Bit,              isSlide)
      .query(`
        UPDATE tblGallery
        SET
          Title    = @title,
          SubTitle = @subTitle,
          IsGrid   = @isGrid,
          IsSlide  = @isSlide
        WHERE Id = @id;
      `);

    res.json({ message: "Gallery updated" });
  } catch (err) {
    console.error("Update gallery error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Delete a gallery */
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

/** ─── GRID HANDLERS ─────────────────────────────────────────────────────────── */

/** List all products in the grid slot */
exports.listGrid = async (req, res) => {
  try {
    const { id } = req.params;
    const pool   = getPool();
    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT GridProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.json(parseJsonOrEmpty(recordset[0].GridProductIds));
  } catch (err) {
    console.error("List grid products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Add one product to the grid slot */
exports.addGrid = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const pool = getPool();

    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT GridProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const arr = parseJsonOrEmpty(recordset[0].GridProductIds);
    if (!arr.includes(productId)) arr.push(productId);

    await pool.request()
      .input("id",             sql.UniqueIdentifier, id)
      .input("gridProductIds", sql.NVarChar,         JSON.stringify(arr))
      .query(`UPDATE tblGallery SET GridProductIds = @gridProductIds WHERE Id = @id;`);

    res.status(201).json(arr);
  } catch (err) {
    console.error("Add grid product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Remove one product from the grid slot */
exports.removeGrid = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const pool = getPool();

    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT GridProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const arr = parseJsonOrEmpty(recordset[0].GridProductIds).filter(pid => pid !== productId);

    await pool.request()
      .input("id",             sql.UniqueIdentifier, id)
      .input("gridProductIds", sql.NVarChar,         JSON.stringify(arr))
      .query(`UPDATE tblGallery SET GridProductIds = @gridProductIds WHERE Id = @id;`);

    res.json(arr);
  } catch (err) {
    console.error("Remove grid product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Re-order the grid product array */
exports.orderGrid = async (req, res) => {
  try {
    const { id } = req.params;
    // **unwrap** the real array from the body
    const { order: newOrder } = req.body;  // ← must be a string[]

    await getPool().request()
      .input("id",             sql.UniqueIdentifier, id)
      .input("gridProductIds", sql.NVarChar,         JSON.stringify(newOrder))
      .query(`UPDATE tblGallery SET GridProductIds = @gridProductIds WHERE Id = @id;`);

    res.json(newOrder);
  } catch (err) {
    console.error("Order grid error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** ─── SLIDE HANDLERS ────────────────────────────────────────────────────────── */

/** List all products in the slide slot */
exports.listSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const pool   = getPool();
    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT SlideProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }
    res.json(parseJsonOrEmpty(recordset[0].SlideProductIds));
  } catch (err) {
    console.error("List slide products error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Add one product to the slide slot */
exports.addSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { productId } = req.body;
    const pool = getPool();

    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT SlideProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const arr = parseJsonOrEmpty(recordset[0].SlideProductIds);
    if (!arr.includes(productId)) arr.push(productId);

    await pool.request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("slideProductIds", sql.NVarChar,         JSON.stringify(arr))
      .query(`UPDATE tblGallery SET SlideProductIds = @slideProductIds WHERE Id = @id;`);

    res.status(201).json(arr);
  } catch (err) {
    console.error("Add slide product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Remove one product from the slide slot */
exports.removeSlide = async (req, res) => {
  try {
    const { id, productId } = req.params;
    const pool = getPool();

    const { recordset } = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT SlideProductIds FROM tblGallery WHERE Id = @id;`);
    if (!recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const arr = parseJsonOrEmpty(recordset[0].SlideProductIds)
      .filter(pid => pid !== productId);

    await pool.request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("slideProductIds", sql.NVarChar,         JSON.stringify(arr))
      .query(`UPDATE tblGallery SET SlideProductIds = @slideProductIds WHERE Id = @id;`);

    res.json(arr);
  } catch (err) {
    console.error("Remove slide product error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Re-order the slide product array */
exports.orderSlide = async (req, res) => {
  try {
    const { id } = req.params;
    const { order: newOrder } = req.body;  // ← unwrap here too

    await getPool().request()
      .input("id",              sql.UniqueIdentifier, id)
      .input("slideProductIds", sql.NVarChar,         JSON.stringify(newOrder))
      .query(`UPDATE tblGallery SET SlideProductIds = @slideProductIds WHERE Id = @id;`);

    res.json(newOrder);
  } catch (err) {
    console.error("Order slide error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
