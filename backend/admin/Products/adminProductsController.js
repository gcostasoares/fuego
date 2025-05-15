/* backend/admin/Products/adminProductsController.js
   ───────────────────────────────────────────────────────────────────────────── */
const sql        = require("mssql");
const { v4: uuidv4 } = require("uuid");

/* ------------------------------------------------------------------ */
/*  Helper utilities                                                  */
/* ------------------------------------------------------------------ */
function getPool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}

const toArray = (v) => (v == null ? [] : Array.isArray(v) ? v : [v]);

/** Build the final ordered image array from the placeholders + uploaded files */
function buildImageArray(imageOrderRaw, files) {
  const order = toArray(
    typeof imageOrderRaw === "string" ? JSON.parse(imageOrderRaw) : imageOrderRaw
  );
  let fileIdx = 0;
  const imgs = order.map((entry) => {
    if (entry === "__NEW__") return files[fileIdx++]?.filename;
    return entry;
  }).filter(Boolean);
  /* if extra files were sent but not referenced in order -> push them */
  while (fileIdx < files.length) imgs.push(files[fileIdx++].filename);
  return imgs;
}

/** Bulk insert `(ProductId, tagId)` rows */
async function insertMany(trx, table, col, productId, ids, tagPrefix) {
  if (!ids.length) return;
  const r = new sql.Request(trx);
  r.input("pid", sql.UniqueIdentifier, productId);
  ids.forEach((id, i) => r.input(`${tagPrefix}${i}`, sql.UniqueIdentifier, id));
  const values = ids.map((_, i) => `(@pid, @${tagPrefix}${i})`).join(",");
  await r.query(`INSERT INTO ${table} (ProductId, ${col}) VALUES ${values}`);
}

/* ------------------------------------------------------------------ */
/*  GET all / single                                                  */
/* ------------------------------------------------------------------ */
exports.getProducts = async (_req, res) => {
  try {
    const { recordset } = await getPool().request().query(`
      SELECT
        p.Id, p.Name, p.SaleName, p.Genetics, p.Rating, p.CBD, p.THC,
        p.Price, p.IsAvailable, p.ImagePath AS imageUrl,
        p.ManufacturerId, p.OriginId, p.RayId,
        m.Name AS manufacturer, o.Name AS origin, r.Name AS ray
      FROM tblProducts p
      LEFT JOIN tblManufacturers m ON p.ManufacturerId = m.Id
      LEFT JOIN tblOrigins       o ON p.OriginId       = o.Id
      LEFT JOIN tblRays          r ON p.RayId          = r.Id
      ORDER BY p.Name
    `);
    res.json(recordset);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { recordset } = await getPool().request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(`SELECT * FROM tblProducts WHERE Id = @id`);
    if (!recordset.length) return res.status(404).json({ error: "Not found" });

    const p = recordset[0];
    try { p.ImagePath = JSON.parse(String(p.ImagePath || "[]").replace(/\\/g, "")); }
    catch { p.ImagePath = []; }

    res.json(p);
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ------------------------------------------------------------------ */
/*  CREATE                                                            */
/* ------------------------------------------------------------------ */
exports.createProduct = async (req, res) => {
  const trx = new sql.Transaction(getPool());
  try {
    await trx.begin();

    /* ---------- build photo array ---------- */
    const images = buildImageArray(req.body.imageOrder, req.files || []);

    /* ---------- main insert ---------- */
    const productId = uuidv4();
    const q = new sql.Request(trx)
      .input("id",                sql.UniqueIdentifier, productId)
      .input("name",              sql.NVarChar,         req.body.name)
      .input("saleName",          sql.NVarChar,         req.body.saleName)
      .input("genetics",          sql.NVarChar,         req.body.genetics)
      .input("rating",            sql.Int,              +req.body.rating || 0)
      .input("cbd",               sql.Decimal,          req.body.cbd)
      .input("thc",               sql.Decimal,          req.body.thc)
      .input("price",             sql.Money,            req.body.price)
      .input("isAvailable",       sql.Bit,              !!+req.body.isAvailable)
      .input("manufacturerId",    sql.UniqueIdentifier, req.body.manufacturerId || null)
      .input("originId",          sql.UniqueIdentifier, req.body.originId || null)
      .input("rayId",             sql.UniqueIdentifier, req.body.rayId || null)
      .input("aboutFlower",       sql.NVarChar,         req.body.aboutFlower)
      .input("growerDescription", sql.NVarChar,         req.body.growerDescription)
      .input("defaultImageIndex", sql.Int,              0)
      .input("imagePath",         sql.NVarChar(sql.MAX), JSON.stringify(images));

    await q.query(`
      INSERT INTO tblProducts
        (Id, Name, SaleName, Genetics, Rating, CBD, THC, Price, IsAvailable,
         ManufacturerId, OriginId, RayId,
         AboutFlower, GrowerDescription, DefaultImageIndex, ImagePath)
      VALUES
        (@id, @name, @saleName, @genetics, @rating, @cbd, @thc, @price, @isAvailable,
         @manufacturerId, @originId, @rayId,
         @aboutFlower, @growerDescription, @defaultImageIndex, @imagePath)
    `);

    /* ---------- junction tables ---------- */
    await insertMany(trx, "tblProductEffect",  "EffectId",
                     productId, toArray(req.body.effectFilter),  "e");
    await insertMany(trx, "tblProductTerpene", "TerpeneId",
                     productId, toArray(req.body.terpeneFilter), "t");
    await insertMany(trx, "tblProductTaste",   "TasteId",
                     productId, toArray(req.body.tasteFilter),   "s");

    await trx.commit();
    res.status(201).json({ message: "Product created", id: productId });
  } catch (err) {
    await trx.rollback();
    console.error("createProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ------------------------------------------------------------------ */
/*  UPDATE                                                            */
/* ------------------------------------------------------------------ */
exports.updateProduct = async (req, res) => {
  const trx = new sql.Transaction(getPool());
  try {
    await trx.begin();

    const id = req.params.id;
    const images = buildImageArray(req.body.imageOrder, req.files || []);

    /* ---------- update row ---------- */
    const r = new sql.Request(trx)
      .input("id",                sql.UniqueIdentifier, id)
      .input("name",              sql.NVarChar,         req.body.name)
      .input("saleName",          sql.NVarChar,         req.body.saleName)
      .input("genetics",          sql.NVarChar,         req.body.genetics)
      .input("rating",            sql.Int,              +req.body.rating || 0)
      .input("cbd",               sql.Decimal,          req.body.cbd)
      .input("thc",               sql.Decimal,          req.body.thc)
      .input("price",             sql.Money,            req.body.price)
      .input("isAvailable",       sql.Bit,              !!+req.body.isAvailable)
      .input("manufacturerId",    sql.UniqueIdentifier, req.body.manufacturerId || null)
      .input("originId",          sql.UniqueIdentifier, req.body.originId || null)
      .input("rayId",             sql.UniqueIdentifier, req.body.rayId || null)
      .input("aboutFlower",       sql.NVarChar,         req.body.aboutFlower)
      .input("growerDescription", sql.NVarChar,         req.body.growerDescription)
      .input("defaultImageIndex", sql.Int,              0)
      .input("imagePath",         sql.NVarChar(sql.MAX), JSON.stringify(images));

    await r.query(`
      UPDATE tblProducts SET
        Name               = @name,
        SaleName           = @saleName,
        Genetics           = @genetics,
        Rating             = @rating,
        CBD                = @cbd,
        THC                = @thc,
        Price              = @price,
        IsAvailable        = @isAvailable,
        ManufacturerId     = @manufacturerId,
        OriginId           = @originId,
        RayId              = @rayId,
        AboutFlower        = @aboutFlower,
        GrowerDescription  = @growerDescription,
        DefaultImageIndex  = @defaultImageIndex,
        ImagePath          = @imagePath
      WHERE Id = @id
    `);

    /* ---------- refresh tags ---------- */
    await new sql.Request(trx)
      .input("pid", sql.UniqueIdentifier, id)
      .query(`
        DELETE FROM tblProductEffect  WHERE ProductId = @pid;
        DELETE FROM tblProductTerpene WHERE ProductId = @pid;
        DELETE FROM tblProductTaste   WHERE ProductId = @pid;
      `);

    await insertMany(trx, "tblProductEffect",  "EffectId",
                     id, toArray(req.body.effectFilter),  "e");
    await insertMany(trx, "tblProductTerpene", "TerpeneId",
                     id, toArray(req.body.terpeneFilter), "t");
    await insertMany(trx, "tblProductTaste",   "TasteId",
                     id, toArray(req.body.tasteFilter),   "s");

    await trx.commit();
    res.json({ message: "Product updated" });
  } catch (err) {
    await trx.rollback();
    console.error("updateProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/* ------------------------------------------------------------------ */
/*  DELETE                                                            */
/* ------------------------------------------------------------------ */
exports.deleteProduct = async (req, res) => {
  const trx = new sql.Transaction(getPool());
  try {
    await trx.begin();

    await new sql.Request(trx)
      .input("pid", sql.UniqueIdentifier, req.params.id)
      .query(`
        DELETE FROM tblProductEffect  WHERE ProductId = @pid;
        DELETE FROM tblProductTerpene WHERE ProductId = @pid;
        DELETE FROM tblProductTaste   WHERE ProductId = @pid;
        DELETE FROM tblProducts       WHERE Id        = @pid;
      `);

    await trx.commit();
    res.json({ message: "Product deleted" });
  } catch (err) {
    await trx.rollback();
    console.error("deleteProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
