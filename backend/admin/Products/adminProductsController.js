/* backend/admin/Products/adminProductsController.js
   ─────────────────────────────────────────────────────────────────────────────
   * identical to your last working version, plus:
   * buildImageArray() helper
   * store ImagePath JSON in CREATE and UPDATE
*/

const sql          = require("mssql");
const { v4: uuidv4 } = require("uuid");

/* helper to grab the global MSSQL pool that server.js created */
function getPool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}

/* ───────────────────────────── helpers ──────────────────────────────────── */

/** Normalises formData fields that can be sent once or many times */
function toIdArray(val) {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

/** Build final ["profile.jpg","gal1.jpg", …] from imageOrder + uploaded files */
function buildImageArray(orderRaw, files = []) {
  if (!orderRaw) return files.map(f => f.filename);         // no order field
  const order = typeof orderRaw === "string" ? JSON.parse(orderRaw) : orderRaw;
  let i = 0;
  const imgs = order.map(e => (e === "__NEW__" ? files[i++]?.filename : e))
                    .filter(Boolean);
  while (i < files.length) imgs.push(files[i++].filename);  // leftovers
  return imgs;
}

/** Bulk-insert many `(ProductId, tagId)` rows in one VALUES (…) statement */
async function insertMany(trx, table, col, productId, ids, tagPrefix) {
  if (!ids.length) return;

  const r = new sql.Request(trx);
  r.input("pid", sql.UniqueIdentifier, productId);

  ids.forEach((id, i) =>
    r.input(`${tagPrefix}${i}`, sql.UniqueIdentifier, id)
  );

  const values = ids.map((_, i) => `(@pid, @${tagPrefix}${i})`).join(",");
  await r.query(`INSERT INTO ${table} (ProductId, ${col}) VALUES ${values}`);
}

/* ───────────────────────────── queries ──────────────────────────────────── */

/** GET /Products/ – list all products for the admin UI */
exports.getProducts = async (_req, res) => {
  try {
    const result = await getPool().request().query(`
      SELECT
        p.Id              AS id,
        p.Name            AS name,
        p.SaleName        AS saleName,
        p.Genetics        AS genetics,
        p.Rating          AS rating,
        p.CBD             AS cbd,
        p.THC             AS thc,
        p.Price           AS price,
        p.IsAvailable     AS isAvailable,
        p.ImagePath       AS imageUrl,
        p.ManufacturerId  AS manufacturerId,
        p.OriginId        AS originId,
        p.RayId           AS rayId,
        m.Name            AS manufacturer,
        o.Name            AS origin,
        r.Name            AS ray
      FROM tblProducts p
      LEFT JOIN tblManufacturers m ON p.ManufacturerId = m.Id
      LEFT JOIN tblOrigins       o ON p.OriginId       = o.Id
      LEFT JOIN tblRays          r ON p.RayId          = r.Id
      ORDER BY p.Name
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** GET /Products/:id – single product incl. gallery JSON */
exports.getProductById = async (req, res) => {
  try {
    const result = await getPool().request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(`SELECT * FROM tblProducts WHERE Id = @id`);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = result.recordset[0];
    try {
      product.ImagePath = JSON.parse(
        String(product.ImagePath || "[]").replace(/\\/g, "")
      );
    } catch {
      product.ImagePath = [];
    }

    res.json(product);
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** POST /Products/ – create product + tags + image filenames */
exports.createProduct = async (req, res) => {
  const trx = new sql.Transaction(getPool());

  try {
    await trx.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);

    const productId = uuidv4();
    const {
      name, saleName, genetics, rating = 0,
      cbd, thc, price, isAvailable,
      manufacturerId, originId, rayId,
      aboutFlower, growerDescription, defaultImageIndex = 0,
    } = req.body;

    /* build gallery array from files + imageOrder */
    const images = buildImageArray(req.body.imageOrder, req.files || []);

    /* 1) main product row --------------------------------------------------- */
    await new sql.Request(trx)
      .input("id",                sql.UniqueIdentifier, productId)
      .input("name",              sql.NVarChar,         name)
      .input("saleName",          sql.NVarChar,         saleName)
      .input("genetics",          sql.NVarChar,         genetics)
      .input("rating",            sql.Int,              rating)
      .input("cbd",               sql.Decimal,          cbd)
      .input("thc",               sql.Decimal,          thc)
      .input("price",             sql.Money,            price)
      .input("isAvailable",       sql.Bit,              !!+isAvailable)
      .input("manufacturerId",    sql.UniqueIdentifier, manufacturerId || null)
      .input("originId",          sql.UniqueIdentifier, originId       || null)
      .input("rayId",             sql.UniqueIdentifier, rayId          || null)
      .input("aboutFlower",       sql.NVarChar,         aboutFlower)
      .input("growerDescription", sql.NVarChar,         growerDescription)
      .input("defaultImageIndex", sql.Int,              defaultImageIndex)
      .input("imagePath",         sql.NVarChar(sql.MAX), JSON.stringify(images))
      .query(`
        INSERT INTO tblProducts
          (Id, Name, SaleName, Genetics, Rating, CBD, THC, Price, IsAvailable,
           ManufacturerId, OriginId, RayId,
           AboutFlower, GrowerDescription, DefaultImageIndex, ImagePath)
        VALUES
          (@id, @name, @saleName, @genetics, @rating, @cbd, @thc, @price, @isAvailable,
           @manufacturerId, @originId, @rayId,
           @aboutFlower, @growerDescription, @defaultImageIndex, @imagePath)
      `);

    /* 2) junction tables ---------------------------------------------------- */
    await insertMany(trx, "tblProductEffect",  "EffectId",  productId, toIdArray(req.body.effectFilter),  "e");
    await insertMany(trx, "tblProductTerpene", "TerpeneId", productId, toIdArray(req.body.terpeneFilter), "t");
    await insertMany(trx, "tblProductTaste",   "TasteId",   productId, toIdArray(req.body.tasteFilter),   "s");

    await trx.commit();
    res.status(201).json({ message: "Product created", id: productId });
  } catch (err) {
    await trx.rollback();
    console.error("createProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** PUT /Products/:id – update row + refresh tags & images */
exports.updateProduct = async (req, res) => {
  const trx = new sql.Transaction(getPool());

  try {
    await trx.begin(sql.ISOLATION_LEVEL.READ_COMMITTED);

    const {
      name, saleName, genetics, rating = 0,
      cbd, thc, price, isAvailable,
      manufacturerId, originId, rayId,
      aboutFlower, growerDescription, defaultImageIndex = 0,
    } = req.body;
    const productId = req.params.id;

    const images = buildImageArray(req.body.imageOrder, req.files || []);

    /* 1) update main row ---------------------------------------------------- */
    await new sql.Request(trx)
      .input("id",                sql.UniqueIdentifier, productId)
      .input("name",              sql.NVarChar,         name)
      .input("saleName",          sql.NVarChar,         saleName)
      .input("genetics",          sql.NVarChar,         genetics)
      .input("rating",            sql.Int,              rating)
      .input("cbd",               sql.Decimal,          cbd)
      .input("thc",               sql.Decimal,          thc)
      .input("price",             sql.Money,            price)
      .input("isAvailable",       sql.Bit,              !!+isAvailable)
      .input("manufacturerId",    sql.UniqueIdentifier, manufacturerId || null)
      .input("originId",          sql.UniqueIdentifier, originId       || null)
      .input("rayId",             sql.UniqueIdentifier, rayId          || null)
      .input("aboutFlower",       sql.NVarChar,         aboutFlower)
      .input("growerDescription", sql.NVarChar,         growerDescription)
      .input("defaultImageIndex", sql.Int,              defaultImageIndex)
      .input("imagePath",         sql.NVarChar(sql.MAX), JSON.stringify(images))
      .query(`
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

    /* 2) clear existing tags ---------------------------------------------- */
    await new sql.Request(trx)
      .input("pid", sql.UniqueIdentifier, productId)
      .query(`
        DELETE FROM tblProductEffect  WHERE ProductId = @pid;
        DELETE FROM tblProductTerpene WHERE ProductId = @pid;
        DELETE FROM tblProductTaste   WHERE ProductId = @pid;
      `);

    /* 3) re-insert current selections ------------------------------------- */
    await insertMany(trx, "tblProductEffect",  "EffectId",  productId, toIdArray(req.body.effectFilter),  "e");
    await insertMany(trx, "tblProductTerpene", "TerpeneId", productId, toIdArray(req.body.terpeneFilter), "t");
    await insertMany(trx, "tblProductTaste",   "TasteId",   productId, toIdArray(req.body.tasteFilter),   "s");

    await trx.commit();
    res.json({ message: "Product updated" });
  } catch (err) {
    await trx.rollback();
    console.error("updateProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** DELETE /Products/:id – remove product + tags */
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
