const sql      = require("mssql");
const { v4: uuidv4 } = require("uuid");

function pool() {
  if (!global.pool) throw new Error("Database pool not initialized");
  return global.pool;
}

/** List all sale‐product entries */
exports.listSaleProducts = async (_req, res) => {
  const { recordset } = await pool()
    .request()
    .query(`
      SELECT
        Id         AS id,
        ProductId  AS productId,
        Price      AS price,
        Title      AS title,
        SubTitle   AS subTitle,
        CreatedAt  AS createdAt
      FROM tblSaleProducts
      ORDER BY CreatedAt DESC
    `);
  res.json(recordset);
};

/** Get one by ID */
exports.getSaleProduct = async (req, res) => {
  const { id } = req.params;
  const r = await pool()
    .request()
    .input("id", sql.UniqueIdentifier, id)
    .query(`
      SELECT
        Id         AS id,
        ProductId  AS productId,
        Price      AS price,
        Title      AS title,
        SubTitle   AS subTitle,
        CreatedAt  AS createdAt
      FROM tblSaleProducts
      WHERE Id = @id
    `);
  if (!r.recordset.length) return res.status(404).json({ error: "Not found" });
  res.json(r.recordset[0]);
};

/** Create new sale‐price entry */
exports.createSaleProduct = async (req, res) => {
  const { productId, price, title = "", subTitle = "" } = req.body;
  if (!productId || price == null) {
    return res.status(400).json({ error: "productId and price required" });
  }
  const id = uuidv4();
  await pool()
    .request()
    .input("id",         sql.UniqueIdentifier, id)
    .input("productId",  sql.UniqueIdentifier, productId)
    .input("price",      sql.Decimal(18,2),     price)
    .input("title",      sql.NVarChar(256),     title.trim())
    .input("subTitle",   sql.NVarChar(256),     subTitle.trim())
    .query(`
      INSERT INTO tblSaleProducts
        (Id, ProductId, Price, Title, SubTitle)
      VALUES
        (@id, @productId, @price, @title, @subTitle)
    `);
  res.status(201).json({ id });
};

/** Update one */
exports.updateSaleProduct = async (req, res) => {
  const { id } = req.params;
  const { productId, price, title, subTitle } = req.body;
  const r = pool().request().input("id", sql.UniqueIdentifier, id);
  const sets = [];

  if (productId) {
    r.input("productId", sql.UniqueIdentifier, productId);
    sets.push("ProductId = @productId");
  }
  if (price != null) {
    r.input("price", sql.Decimal(18,2), price);
    sets.push("Price = @price");
  }
  if (title != null) {
    r.input("title", sql.NVarChar(256), title.trim());
    sets.push("Title = @title");
  }
  if (subTitle != null) {
    r.input("subTitle", sql.NVarChar(256), subTitle.trim());
    sets.push("SubTitle = @subTitle");
  }

  if (!sets.length) {
    return res.status(400).json({ error: "Nothing to update" });
  }

  await r.query(`
    UPDATE tblSaleProducts
    SET ${sets.join(", ")}
    WHERE Id = @id
  `);

  res.json({ ok: true });
};

/** Delete one */
exports.deleteSaleProduct = async (req, res) => {
  const { id } = req.params;
  await pool()
    .request()
    .input("id", sql.UniqueIdentifier, id)
    .query("DELETE FROM tblSaleProducts WHERE Id = @id");
  res.json({ ok: true });
};
