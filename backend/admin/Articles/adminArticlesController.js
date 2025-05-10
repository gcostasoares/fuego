// backend/admin/Articles/adminArticlesController.js

const sql         = require("mssql");
const { v4: uuidv4 } = require("uuid");

/**
 * Strip off any leading "NN-" prefix (exactly 2 digits + dash).
 * e.g. "03-My Title" → "My Title", but leaves "A-1" untouched.
 */
function stripNumericPrefix(s) {
  return s.replace(/^[0-9]{2}-/, "");
}

function getPool() {
  if (!global.pool) {
    throw new Error("Database pool not initialized");
  }
  return global.pool;
}

/** List all articles by their numeric prefix (if any), then title */
exports.listArticles = async (req, res) => {
  try {
    const pool = getPool();
    const result = await pool.request().query(`
      SELECT
        Id        AS id,
        Title     AS title,
        Content   AS content,
        URL       AS url,
        ImagePath AS imagePath,
        Date      AS date,
        TagIds    AS tagIds
      FROM tblArticles
      ORDER BY
        CASE
          WHEN Title LIKE '[0-9][0-9]-%' 
            THEN TRY_CAST(LEFT(Title,2) AS INT)
          ELSE 999
        END,
        SUBSTRING(Title, 4, 8000)
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("listArticles error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Get a single article */
exports.getArticle = async (req, res) => {
  try {
    const pool    = getPool();
    const request = pool.request().input("id", sql.UniqueIdentifier, req.params.id);
    const result  = await request.query(`
      SELECT Id AS id, Title AS title, Content AS content, URL AS url,
             ImagePath AS imagePath, Date AS date, TagIds AS tagIds
      FROM tblArticles
      WHERE Id = @id
    `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("getArticle error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Create a new article */
exports.createArticle = async (req, res) => {
  try {
    const pool      = getPool();
    const id        = uuidv4();
    const { title, content, url, date, tagIds } = req.body;
    const imagePath = req.file?.filename || null;

    await pool.request()
      .input("id",        sql.UniqueIdentifier, id)
      .input("title",     sql.NVarChar,         title)
      .input("content",   sql.NVarChar,         content)
      .input("url",       sql.NVarChar,         url)
      .input("imagePath", sql.NVarChar,         imagePath)
      .input("date",      sql.DateTime,         date)
      .input("tagIds",    sql.NVarChar,         tagIds || "[]")
      .query(`
        INSERT INTO tblArticles
          (Id, Title, Content, URL, ImagePath, Date, TagIds)
        VALUES
          (@id, @title, @content, @url, @imagePath, @date, @tagIds)
      `);

    res.status(201).json({ message: "Article created", id });
  } catch (err) {
    console.error("createArticle error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Update an article (strips any NN- prefix before saving) */
exports.updateArticle = async (req, res) => {
  try {
    const pool = getPool();
    const id   = req.params.id;

    // 1) Destructure and strip any prefix
    let { title, content, url, date, tagIds, clearImage } = req.body;
    if (typeof title === "string") {
      title = stripNumericPrefix(title);
    }
    const newFilename = req.file?.filename;

    // 2) Load existing
    const existingRes = await pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT Title, Content, URL, Date, TagIds, ImagePath
        FROM tblArticles
        WHERE Id = @id
      `);
    if (!existingRes.recordset.length) {
      return res.status(404).json({ error: "Article not found" });
    }
    const old = existingRes.recordset[0];

    // 3) Merge values
    const finalTitle   = title   ?? old.Title;
    const finalContent = content ?? old.Content;
    const finalUrl     = url     ?? old.URL;
    const finalDate    = date    ?? old.Date;
    const finalTags    = tagIds  ?? old.TagIds;

    // 4) Bind inputs
    const r = pool.request()
      .input("id",      sql.UniqueIdentifier, id)
      .input("title",   sql.NVarChar,         finalTitle)
      .input("content", sql.NVarChar,         finalContent)
      .input("url",     sql.NVarChar,         finalUrl)
      .input("date",    sql.DateTime,         finalDate)
      .input("tagIds",  sql.NVarChar,         finalTags);

    if (newFilename) {
      r.input("imagePath", sql.NVarChar, newFilename);
    } else if (clearImage === "true" || clearImage === true) {
      r.input("imagePath", sql.NVarChar, "");
    }

    // 5) Build SET clause
    let setClause = `
      Title   = @title,
      Content = @content,
      URL     = @url,
      Date    = @date,
      TagIds  = @tagIds
    `;
    if (newFilename || clearImage === "true" || clearImage === true) {
      setClause += `, ImagePath = @imagePath`;
    }

    // 6) Execute
    await r.query(`
      UPDATE tblArticles
      SET ${setClause}
      WHERE Id = @id
    `);

    res.json({ message: "Article updated" });
  } catch (err) {
    console.error("updateArticle error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Delete an article */
exports.deleteArticle = async (req, res) => {
  try {
    await getPool().request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(`DELETE FROM tblArticles WHERE Id = @id`);
    res.json({ message: "Article deleted" });
  } catch (err) {
    console.error("deleteArticle error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/** Reorder: correctly rebuild "NN-rawTitle" using only a 2-digit prefix */
exports.reorderArticles = async (req, res) => {
  try {
    const pool  = getPool();
    const order = req.body.order; // [{id, position},…]
    if (!Array.isArray(order)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    // Build a batch of UPDATE statements
    const sqlBatch = order.map(({ id, position }) => {
      // prefix = "NN"
      const nn = position.toString().padStart(2, "0");
      return `
        UPDATE tblArticles
        SET Title =
          '${nn}-' + 
          CASE
            WHEN Title LIKE '[0-9][0-9]-%' THEN SUBSTRING(Title, 4, 8000)
            ELSE Title
          END
        WHERE Id = '${id}'
      `;
    }).join(";\n") + ";";

    await pool.request().batch(sqlBatch);
    res.json({ message: "Reordered" });
  } catch (err) {
    console.error("reorderArticles error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
