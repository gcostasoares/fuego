// backend/admin/Products/adminProductsController.js

const sql       = require("mssql");
const { v4: uuidv4 } = require("uuid");

/** helper to get the MSSQL pool */
function getPool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}

/** GET /Products/ */
exports.getProducts = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        Id              AS id,
        Name            AS name,
        SaleName        AS saleName,
        Genetics        AS genetics,
        Rating          AS rating,
        CBD             AS cbd,
        THC             AS thc,
        Price           AS price,
        IsAvailable     AS isAvailable,
        ImagePath       AS imageUrl,
        ManufacturerId  AS manufacturerId,
        OriginId        AS originId,
        RayId           AS rayId
      FROM tblProducts
      ORDER BY Name
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("getProducts error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** GET /Products/:id */
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id                 AS id,
          Name               AS name,
          SaleName           AS saleName,
          Genetics           AS genetics,
          Rating             AS rating,
          CBD                AS cbd,
          THC                AS thc,
          Price              AS price,
          IsAvailable        AS isAvailable,
          ImagePath          AS imageUrl,
          ManufacturerId     AS manufacturerId,
          OriginId           AS originId,
          RayId              AS rayId,
          AboutFlower        AS aboutFlower,
          GrowerDescription  AS growerDescription,
          DefaultImageIndex  AS defaultImageIndex
        FROM tblProducts
        WHERE Id = @id
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Product not found" });
    }

    // parse the JSON array of image URLs
    const product = result.recordset[0];
    try {
      product.imageUrl = JSON.parse(product.imageUrl || "[]");
    } catch {
      product.imageUrl = [];
    }

    res.json(product);
  } catch (err) {
    console.error("getProductById error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** POST /Products/ */
exports.createProduct = async (req, res) => {
  try {
    const pool = getPool();
    const id = uuidv4();
    const {
      name, saleName, genetics, rating,
      cbd, thc, price, isAvailable,
      manufacturerId, originId, rayId,
      aboutFlower, growerDescription, defaultImageIndex
    } = req.body;

    await pool.request()
      .input("id",                sql.UniqueIdentifier, id)
      .input("name",              sql.NVarChar,         name)
      .input("saleName",          sql.NVarChar,         saleName)
      .input("genetics",          sql.NVarChar,         genetics)
      .input("rating",            sql.Int,              rating)
      .input("cbd",               sql.Decimal,          cbd)
      .input("thc",               sql.Decimal,          thc)
      .input("price",             sql.Money,            price)
      .input("isAvailable",       sql.Bit,              isAvailable)
      .input("manufacturerId",    sql.UniqueIdentifier, manufacturerId)
      .input("originId",          sql.UniqueIdentifier, originId)
      .input("rayId",             sql.UniqueIdentifier, rayId)
      .input("aboutFlower",       sql.NVarChar,         aboutFlower)
      .input("growerDescription", sql.NVarChar,         growerDescription)
      .input("defaultImageIndex", sql.Int,              0)                // always 0
      .query(`
        INSERT INTO tblProducts
          (Id, Name, SaleName, Genetics, Rating,
           CBD, THC, Price, IsAvailable,
           ManufacturerId, OriginId, RayId,
           AboutFlower, GrowerDescription, DefaultImageIndex)
        VALUES
          (@id, @name, @saleName, @genetics, @rating,
           @cbd, @thc, @price, @isAvailable,
           @manufacturerId, @originId, @rayId,
           @aboutFlower, @growerDescription, @defaultImageIndex)
      `);

    res.status(201).json({ message: "Product created", id });
  } catch (err) {
    console.error("createProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** PUT /Products/:id */
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, saleName, genetics, rating,
      cbd, thc, price, isAvailable,
      manufacturerId, originId, rayId,
      aboutFlower, growerDescription, defaultImageIndex
    } = req.body;

    const pool = getPool();
    await pool.request()
      .input("id",                sql.UniqueIdentifier, id)
      .input("name",              sql.NVarChar,         name)
      .input("saleName",          sql.NVarChar,         saleName)
      .input("genetics",          sql.NVarChar,         genetics)
      .input("rating",            sql.Int,              rating)
      .input("cbd",               sql.Decimal,          cbd)
      .input("thc",               sql.Decimal,          thc)
      .input("price",             sql.Money,            price)
      .input("isAvailable",       sql.Bit,              isAvailable)
      .input("manufacturerId",    sql.UniqueIdentifier, manufacturerId)
      .input("originId",          sql.UniqueIdentifier, originId)
      .input("rayId",             sql.UniqueIdentifier, rayId)
      .input("aboutFlower",       sql.NVarChar,         aboutFlower)
      .input("growerDescription", sql.NVarChar,         growerDescription)
      .input("defaultImageIndex", sql.Int,              0)                // always 0
      .query(`
        UPDATE tblProducts
        SET
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
          DefaultImageIndex  = @defaultImageIndex
        WHERE Id = @id
      `);

    res.json({ message: "Product updated" });
  } catch (err) {
    console.error("updateProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** DELETE /Products/:id */
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = getPool();
    await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM tblProducts WHERE Id = @id`);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
