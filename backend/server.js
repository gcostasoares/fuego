const bcrypt = require("bcryptjs");
const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 8081;
const saltRounds = 10;
const dotenv = require('dotenv');
const multer = require("multer");
const path = require("path");
const jwt = require('jsonwebtoken');

dotenv.config();


app.set("case sensitive routing", true);
app.use(cors());
app.use(express.json());
app.use("/images", (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
}, express.static("public/images"));
app.use(
  cors({
    origin: [
      "https://fuego-dev.onrender.com",
      "https://fuego-ombm.onrender.com",
    ],
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization","x-admin-key"],
  })
);

const dbConfig = {
  user:           process.env.DB_USER,
  password:       process.env.DB_PASSWORD,
  server:         process.env.DB_SERVER,          // e.g. fuego-server.database.windows.net
  port:           parseInt(process.env.DB_PORT),  // 1433
  database:       process.env.DB_NAME,            // e.g. FuegoDB
  options: {
    encrypt:              true,   // Azure requires encryption
    trustServerCertificate: false // only for dev – set true if you have cert issues
  },
};

let pool;
sql.connect(dbConfig)
  .then((connectionPool) => {
    pool = connectionPool;
    console.log("✅ Connected to MSSQL Database");
    global.pool = pool;
  })
  .catch((err) => console.error("❌ Database connection failed:", err));


  const DOCTORS_QUERY = `
  SELECT 
    Id AS id,
    Name AS name,
    Description AS description,
    ProfileUrl AS profileUrl,
    Phone AS phone,
    IsVerified AS isVerified,
    Email AS email,
    Address AS address,
    Lat AS lat,
    Long AS long,
    Price AS price,
    StartDay AS startDay,
    EndDay AS endDay,
    StartTime AS startTime,
    EndTime AS endTime,
    ImagePath AS imagePath,
    CoverImagePath AS coverImagePath
  FROM tblDoctors
`;

const PHARMACY_QUERY = `
  SELECT 
    Id AS id,
    Name AS name,
    Description AS description,
    ProfileUrl AS profileUrl,
    Phone AS phone,
    IsVerified AS isVerified,
    Email AS email,
    Address AS address,
    Lat AS lat,
    Long AS long,
    ImagePath AS imagePath,
    CoverImagePath AS coverImagePath
  FROM tblPharmacies
`;

app.get("/shops", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const request = new sql.Request(pool);
    request.input("searchQuery", sql.NVarChar, `%${searchQuery}%`);

    const query = `
      SELECT * 
      FROM tblCBDShops
      WHERE Name LIKE @searchQuery
      ORDER BY Name
    `;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});


// GET Doctors Route
app.get("/doctors", async (req, res) => {
  try {
    const { name, address, pageNumber = 1, pageSize = 10 } = req.query;
    const request = new sql.Request(pool);
    
    let whereClauses = [];
    if (name) {
      whereClauses.push("Name LIKE @name");
      request.input("name", sql.NVarChar, `%${name}%`);
    }
    if (address) {
      whereClauses.push("Address LIKE @address");
      request.input("address", sql.NVarChar, `%${address}%`);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const paging = `ORDER BY Name 
                    OFFSET ${(pageNumber - 1) * pageSize} ROWS 
                    FETCH NEXT ${pageSize} ROWS ONLY`;

    const countQuery = `SELECT COUNT(*) AS total FROM tblDoctors ${where}`;
    const dataQuery = `${DOCTORS_QUERY} ${where} ${paging}`;

    const [countResult, dataResult] = await Promise.all([
      request.query(countQuery),
      request.query(dataQuery)
    ]);

    res.json({
      doctors: dataResult.recordset,
      totalCount: countResult.recordset[0].total
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

app.get("/doctors/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const query = `
      SELECT 
        Id AS id,
        Name AS name,
        Description AS description,
        ProfileUrl AS profileUrl,
        Phone AS phone,
        IsVerified AS isVerified,
        Email AS email,
        Address AS address,
        Lat AS lat,
        Long AS long,
        Price AS price,
        StartDay AS startDay,
        EndDay AS endDay,
        StartTime AS startTime,
        EndTime AS endTime,
        ImagePath AS imagePath,
        CoverImagePath AS coverImagePath
      FROM tblDoctors
      WHERE Id = @id
    `;

    const result = await request.query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// Add this route before app.listen()
// ── GET /pharmacy ───────────────────────────────────────────────────────────────
app.get("/pharmacy", async (req, res) => {
  try {
    const { name, address, pageNumber = 1, pageSize = 10 } = req.query;
    const request = new sql.Request(pool);

    // build filtering
    const whereClauses = [];
    if (name) {
      whereClauses.push("Name LIKE @name");
      request.input("name", sql.NVarChar, `%${name}%`);
    }
    if (address) {
      whereClauses.push("Address LIKE @address");
      request.input("address", sql.NVarChar, `%${address}%`);
    }
    const where = whereClauses.length
      ? `WHERE ${whereClauses.join(" AND ")}`
      : "";

    // paging
    const offset = (pageNumber - 1) * pageSize;
    const paging = `
      ORDER BY Name
      OFFSET ${offset} ROWS
      FETCH NEXT ${pageSize} ROWS ONLY
    `;

    // count
    const countResult = await request.query(
      `SELECT COUNT(*) AS total FROM tblPharmacies ${where}`
    );

    // data: use SQL CONVERT to get "HH:mm"
    const dataResult = await request.query(`
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
        CONVERT(varchar(5), StartTime, 108) AS startTime,
        CONVERT(varchar(5), EndTime,   108) AS endTime,
        ImagePath      AS imagePath,
        CoverImagePath AS coverImagePath
      FROM tblPharmacies
      ${where}
      ${paging}
    `);

    res.json({
      pharmacies: dataResult.recordset,
      totalCount: countResult.recordset[0].total
    });
  } catch (error) {
    console.error("GET /pharmacy error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// ── GET /pharmacy/:id ───────────────────────────────────────────────────────────
app.get("/pharmacy/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`
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
        CONVERT(varchar(5), StartTime, 108) AS startTime,
        CONVERT(varchar(5), EndTime,   108) AS endTime,
        ImagePath      AS imagePath,
        CoverImagePath AS coverImagePath
      FROM tblPharmacies
      WHERE Id = @id
    `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Pharmacy not found" });
    }
    res.json(result.recordset[0]);
  } catch (error) {
    console.error("GET /pharmacy/:id error:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


const CBD_SHOP_QUERY = `
  SELECT 
    Id AS id,
    Name AS name,
    Description AS description,
    ProfileUrl AS profileUrl,
    Phone AS phone,
    IsVerified AS isVerified,
    Email AS email,
    Address AS address,
    Lat AS lat,
    Long AS long,
    Price AS price,
    StartDay AS startDay,
    EndDay AS endDay,
    StartTime AS startTime,
    EndTime AS endTime,
    ImagePath AS imagePath,
    CoverImagePath AS coverImagePath
  FROM tblCBDShops
`;

// CBD Shops List
app.get("/cbdshops", async (req, res) => {
  try {
    const { name, address, pageNumber = 1, pageSize = 10 } = req.query;
    const request = new sql.Request(pool);
    
    let whereClauses = [];
    if (name) {
      whereClauses.push("Name LIKE @name");
      request.input("name", sql.NVarChar, `%${name}%`);
    }
    if (address) {
      whereClauses.push("Address LIKE @address");
      request.input("address", sql.NVarChar, `%${address}%`);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const paging = `ORDER BY Name 
                    OFFSET ${(pageNumber - 1) * pageSize} ROWS 
                    FETCH NEXT ${pageSize} ROWS ONLY`;

    const countQuery = `SELECT COUNT(*) AS total FROM tblCBDShops ${where}`;
    const dataQuery = `${CBD_SHOP_QUERY} ${where} ${paging}`;

    const [countResult, dataResult] = await Promise.all([
      request.query(countQuery),
      request.query(dataQuery)
    ]);

    res.json({
      cbdShops: dataResult.recordset,
      totalCount: countResult.recordset[0].total
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// Single CBD Shop
// CBD Shop Details
app.get("/cbdshops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const query = `
      SELECT 
        Id AS id,
        Name AS name,
        Description AS description,
        ProfileUrl AS profileUrl,
        Phone AS phone,
        IsVerified AS isVerified,
        Email AS email,
        Address AS address,
        Lat AS lat,
        Long AS long,
        Price AS price,
        StartDay AS startDay,
        EndDay AS endDay,
        StartTime AS startTime,
        EndTime AS endTime,
        ImagePath AS imagePath,
        CoverImagePath AS coverImagePath
      FROM tblCBDShops
      WHERE Id = @id
    `;

    const result = await request.query(query);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "CBD Shop not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});


const HEAD_SHOP_QUERY = `
  SELECT 
    Id AS id,
    Name AS name,
    Description AS description,
    ProfileUrl AS profileUrl,
    Phone AS phone,
    IsVerified AS isVerified,
    Email AS email,
    Address AS address,
    Lat AS lat,
    Long AS long,
    Price AS price,
    StartDay AS startDay,
    EndDay AS endDay,
    StartTime AS startTime,
    EndTime AS endTime,
    ImagePath AS imagePath,
    CoverImagePath AS coverImagePath
  FROM tblHeadShops
`;

// Head Shops List
app.get("/headshops", async (req, res) => {
  try {
    const { name, address, pageNumber = 1, pageSize = 10 } = req.query;
    const request = new sql.Request(pool);
    
    let whereClauses = [];
    if (name) {
      whereClauses.push("Name LIKE @name");
      request.input("name", sql.NVarChar, `%${name}%`);
    }
    if (address) {
      whereClauses.push("Address LIKE @address");
      request.input("address", sql.NVarChar, `%${address}%`);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const paging = `ORDER BY Name 
                    OFFSET ${(pageNumber - 1) * pageSize} ROWS 
                    FETCH NEXT ${pageSize} ROWS ONLY`;

    const countQuery = `SELECT COUNT(*) AS total FROM tblHeadShops ${where}`;
    const dataQuery = `${HEAD_SHOP_QUERY} ${where} ${paging}`;

    const [countResult, dataResult] = await Promise.all([
      request.query(countQuery),
      request.query(dataQuery)
    ]);

    res.json({
      headShops: dataResult.recordset,
      totalCount: countResult.recordset[0].total
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// Single Head Shop
app.get("/headshops/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`${HEAD_SHOP_QUERY} WHERE Id = @id`);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Head Shop not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// ================== GROW EQUIPMENT CONFIG ==================
const GROW_EQUIPMENT_QUERY = `
  SELECT 
    Id AS id,
    Name AS name,
    Description AS description,
    ProfileUrl AS profileUrl,
    Phone AS phone,
    IsVerified AS isVerified,
    Email AS email,
    Address AS address,
    Lat AS lat,
    Long AS long,
    Price AS price,
    StartDay AS startDay,
    EndDay AS endDay,
    StartTime AS startTime,
    EndTime AS endTime,
    ImagePath AS imagePath,
    CoverImagePath AS coverImagePath
  FROM tblGrowEquipments
`;

// Grow Equipment List
app.get("/growequipments", async (req, res) => {
  try {
    const { name, address, pageNumber = 1, pageSize = 10 } = req.query;
    const request = new sql.Request(pool);
    
    let whereClauses = [];
    if (name) {
      whereClauses.push("Name LIKE @name");
      request.input("name", sql.NVarChar, `%${name}%`);
    }
    if (address) {
      whereClauses.push("Address LIKE @address");
      request.input("address", sql.NVarChar, `%${address}%`);
    }

    const where = whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "";
    const paging = `ORDER BY Name 
                    OFFSET ${(pageNumber - 1) * pageSize} ROWS 
                    FETCH NEXT ${pageSize} ROWS ONLY`;

    const countQuery = `SELECT COUNT(*) AS total FROM tblGrowEquipments ${where}`;
    const dataQuery = `${GROW_EQUIPMENT_QUERY} ${where} ${paging}`;

    const [countResult, dataResult] = await Promise.all([
      request.query(countQuery),
      request.query(dataQuery)
    ]);

    res.json({
      growEquipments: dataResult.recordset,
      totalCount: countResult.recordset[0].total
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// Single Grow Equipment
app.get("/growequipments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`${GROW_EQUIPMENT_QUERY} WHERE Id = @id`);
    
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Grow Equipment not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});


app.get("/api/product-filters", async (req, res) => {
  try {
    const [
      terpenes, 
      effects,
      strains,
      manufacturers,
      origins,
      tastes,
      pharmacies,
      rays
    ] = await Promise.all([
      pool.request().query("SELECT Id AS id, Name AS name FROM tblTerpenes"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblEffects"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblStrains"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblManufacturers"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblOrigins"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblTastes"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblPharmacies"),
      pool.request().query("SELECT Id AS id, Name AS name FROM tblRays")
    ]);

    res.json({
      terpenes: terpenes.recordset,
      effects: effects.recordset,
      strains: strains.recordset,
      manufacturers: manufacturers.recordset,
      origins: origins.recordset,
      tastes: tastes.recordset,
      pharmacies: pharmacies.recordset,
      rays: rays.recordset
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});

// Home Data Endpoint
app.get("/api/home", async (req, res) => {
  try {
    const [
      products,
      logos,
      categories,
      articles,
      carousels,
      shopDescriptions,
      shopTitle,
      shopDescription
    ] = await Promise.all([
      pool.request().query(`
        SELECT TOP 12 
          Id AS id,
          Name AS name,
          Price AS price,
          ImagePath AS imageUrl,
          THC AS thc,
          CBD AS cbd
        FROM tblProducts
        ORDER BY NEWID()
      `),
      pool.request().query(`
        SELECT Id AS id, ImagePath AS imageUrl
        FROM tblPartnerLogos
      `),
      pool.request().query(`
        SELECT Id AS id, Name AS name
        FROM tblCategories
      `),
      pool.request().query(`
        SELECT TOP 3 
          Id          AS id,
          Title       AS title,
          Content     AS content,
          URL         AS url,
          ImagePath   AS imageUrl,
          Date        AS createdAt,
          TagIds      AS tagIds
        FROM tblArticles
        ORDER BY CreatedAt DESC
      `),
      pool.request().query(`
        SELECT 
          Id AS id,
          Title AS title,
          Description AS description,
          ImagePath AS imageUrl
        FROM tblCarousels
      `),
      pool.request().query(`
        SELECT 
          Id AS id,
          Title AS title,
          ImagePath   AS imagePath,    
          Description AS description
        FROM tblShopDescriptions
      `),
      pool.request().query(`
        SELECT TOP 1 ShopSectionTitle AS value
        FROM tblAppContent
      `),
      pool.request().query(`
        SELECT TOP 1 ShopSectionDescription AS value
        FROM tblAppContent
      `)
    ]);

    res.json({
      products: products.recordset,
      logos: logos.recordset,
      categories: categories.recordset,
      articles: articles.recordset,
      carousels: carousels.recordset,
      shopDescriptions: shopDescriptions.recordset,
      shopSectionTitle: shopTitle.recordset[0]?.value || "Our Products",
      shopSectionDescription: shopDescription.recordset[0]?.value || "Explore our curated selection"
    });
  } catch (error) {
    res.status(500).json({
      error: "Internal Server Error",
      details: error.message
    });
  }
});



app.get("/products", async (req, res) => {
  try {
    // 1) Parse pagination parameters (default to page 1, size 25)
    const page     = parseInt(req.query.page,     10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 25;
    const offset   = (page - 1) * pageSize;

    // 2) Extract filters from query
    const {
      filterName,
      cbd,
      maxCbd,
      thc,
      maxThc,
      minPrice,
      maxPrice,
      effectFilter,
      terpeneFilter,
      tasteFilter,
      strains,
      origin,
      selectedManufacturerIds,
      pharmacy
    } = req.query;

    // 3) Prepare a new SQL request and build dynamic WHERE clauses & JOINs
    const request      = new sql.Request(pool);
    const whereClauses = [];
    const joins        = [];

    if (filterName) {
      whereClauses.push("p.Name LIKE @filterName");
      request.input("filterName", sql.NVarChar, `%${filterName}%`);
    }
    if (cbd) {
      whereClauses.push("p.CBD >= @cbd");
      request.input("cbd", sql.Decimal, parseFloat(cbd));
    }
    if (maxCbd) {
      whereClauses.push("p.CBD <= @maxCbd");
      request.input("maxCbd", sql.Decimal, parseFloat(maxCbd));
    }
    if (thc) {
      whereClauses.push("p.THC >= @thc");
      request.input("thc", sql.Decimal, parseFloat(thc));
    }
    if (maxThc) {
      whereClauses.push("p.THC <= @maxThc");
      request.input("maxThc", sql.Decimal, parseFloat(maxThc));
    }
    if (minPrice) {
      whereClauses.push("p.Price >= @minPrice");
      request.input("minPrice", sql.Money, parseFloat(minPrice));
    }
    if (maxPrice) {
      whereClauses.push("p.Price <= @maxPrice");
      request.input("maxPrice", sql.Money, parseFloat(maxPrice));
    }

    // helper to normalize a single value or array → array
    function toArray(val) {
      if (!val) return [];
      return Array.isArray(val) ? val : [val];
    }

    const effectIds   = toArray(effectFilter);
    const terpeneIds  = toArray(terpeneFilter);
    const tasteIds    = toArray(tasteFilter);
    const strainId    = strains;
    const originId    = origin;
    const manuIds     = toArray(selectedManufacturerIds);
    const pharmacyIds = toArray(pharmacy);

    if (effectIds.length) {
      joins.push("INNER JOIN tblProductEffect pe ON p.Id = pe.ProductId");
      whereClauses.push(
        `pe.EffectId IN (${effectIds.map((_, i) => `@effect${i}`).join(",")})`
      );
      effectIds.forEach((id, i) =>
        request.input(`effect${i}`, sql.UniqueIdentifier, id)
      );
    }

    if (terpeneIds.length) {
      joins.push("INNER JOIN tblProductTerpene pt ON p.Id = pt.ProductId");
      whereClauses.push(
        `pt.TerpeneId IN (${terpeneIds.map((_, i) => `@terpene${i}`).join(",")})`
      );
      terpeneIds.forEach((id, i) =>
        request.input(`terpene${i}`, sql.UniqueIdentifier, id)
      );
    }

    if (tasteIds.length) {
      joins.push("INNER JOIN tblProductTaste pta ON p.Id = pta.ProductId");
      whereClauses.push(
        `pta.TasteId IN (${tasteIds.map((_, i) => `@taste${i}`).join(",")})`
      );
      tasteIds.forEach((id, i) =>
        request.input(`taste${i}`, sql.UniqueIdentifier, id)
      );
    }

    if (strainId) {
      whereClauses.push("p.StrainId = @strainId");
      request.input("strainId", sql.UniqueIdentifier, strainId);
    }

    if (originId) {
      whereClauses.push("p.OriginId = @originId");
      request.input("originId", sql.UniqueIdentifier, originId);
    }

    if (manuIds.length) {
      whereClauses.push(
        `p.ManufacturerId IN (${manuIds.map((_, i) => `@manu${i}`).join(",")})`
      );
      manuIds.forEach((id, i) =>
        request.input(`manu${i}`, sql.UniqueIdentifier, id)
      );
    }

    if (pharmacyIds.length) {
      joins.push("INNER JOIN tblProductPharmacies pph ON p.Id = pph.ProductId");
      whereClauses.push(
        `pph.PharmacyId IN (${pharmacyIds.map((_, i) => `@pharm${i}`).join(",")})`
      );
      pharmacyIds.forEach((id, i) =>
        request.input(`pharm${i}`, sql.UniqueIdentifier, id)
      );
    }

    // 4) Construct the base query, selecting every field you need
    const baseQuery = `
      SELECT DISTINCT
        p.Id                 AS id,
        p.Name               AS name,
        p.SaleName           AS saleName,
        p.FeaturedProduct    AS featuredProduct,
        p.Price              AS price,
        p.THC                AS thc,
        p.CBD                AS cbd,
        p.Genetics           AS genetics,
        p.Rating             AS rating,
        p.ImagePath          AS imageUrl,
        p.IsAvailable        AS isAvailable,
        p.OriginId           AS originId,
        p.ManufacturerId     AS manufacturerId,
        p.RayId              AS rayId,
        p.AboutFlower        AS aboutFlower,
        p.GrowerDescription  AS growerDescription,
        p.DefaultImageIndex  AS defaultImageIndex,
        m.Name               AS manufacturer,
        o.Name               AS origin,
        r.Name               AS ray
      FROM tblProducts p
      LEFT JOIN tblManufacturers m ON p.ManufacturerId = m.Id
      LEFT JOIN tblOrigins       o ON p.OriginId       = o.Id
      LEFT JOIN tblRays          r ON p.RayId          = r.Id
      ${joins.join("\n")}
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
    `;

    // 5) Get total count
    const countResult = await request.query(`
      SELECT COUNT(DISTINCT p.Id) AS total
      FROM tblProducts p
      ${joins.join("\n")}
      ${whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : ""}
    `);

    // 6) Fetch paged data
    request.input("offset",   sql.Int, offset);
    request.input("pageSize", sql.Int, pageSize);
    const dataResult = await request.query(`
      ${baseQuery}
      ORDER BY p.Name
      OFFSET @offset ROWS
      FETCH NEXT @pageSize ROWS ONLY
    `);

    // 7) Parse imageUrl (JSON string) into an array
    const products = dataResult.recordset.map(prod => {
      let imgs;
      try {
        imgs = JSON.parse((prod.imageUrl || "").replace(/\\/g, ""));
        if (!Array.isArray(imgs)) imgs = [];
      } catch {
        imgs = [];
      }
      return { ...prod, imageUrl: imgs };
    });

    // 8) Send the response
    res.json({
      products,
      totalCount: countResult.recordset[0].total
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({
      error: "Failed to fetch products",
      details: err.message
    });
  }
});



app.get("/api/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    // include AboutFlower + GrowerDescription in the SELECT
    const query = `
      SELECT 
        p.Id                  AS id,
        p.Name                AS name,
        p.SaleName            AS saleName,
        p.FeaturedProduct     AS featuredProduct,
        p.Price               AS price,
        p.THC                 AS thc,
        p.CBD                 AS cbd,
        p.Genetics            AS genetics,
        p.ImagePath           AS imageUrl,            -- JSON array
        p.IsAvailable         AS isAvailable,
        p.OriginId            AS originId,
        p.ManufacturerId      AS manufacturerId,
        p.RayId               AS rayId,
        p.AboutFlower         AS aboutFlower,
        p.GrowerDescription   AS growerDescription,
        p.DefaultImageIndex   AS defaultImageIndex
      FROM tblProducts p
      WHERE p.Id = @id
    `;

    const result = await request.query(query);
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const product = result.recordset[0];

    // parse the ImagePath JSON into an array
    try {
      product.imageUrl = JSON.parse(product.imageUrl || "[]");
    } catch {
      product.imageUrl = [];
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});


app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Generate unique IDs and stamps
    const userId = uuidv4().toUpperCase();
    const normalizedEmail = email.toUpperCase();
    const securityStamp = uuidv4().toUpperCase();
    const concurrencyStamp = uuidv4().toUpperCase();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const request = new sql.Request(pool);
    request.input('id', sql.NVarChar(450), userId);
    request.input('userName', sql.NVarChar(256), email);
    request.input('normalizedUserName', sql.NVarChar(256), normalizedEmail);
    request.input('email', sql.NVarChar(256), email);
    request.input('normalizedEmail', sql.NVarChar(256), normalizedEmail);
    request.input('passwordHash', sql.NVarChar(sql.MAX), hashedPassword);
    request.input('securityStamp', sql.NVarChar(sql.MAX), securityStamp);
    request.input('concurrencyStamp', sql.NVarChar(sql.MAX), concurrencyStamp);

    const query = `
      INSERT INTO AspNetUsers (
        Id,
        UserName,
        NormalizedUserName,
        Email,
        NormalizedEmail,
        EmailConfirmed,
        PasswordHash,
        SecurityStamp,
        ConcurrencyStamp,
        PhoneNumberConfirmed,
        TwoFactorEnabled,
        LockoutEnabled,
        AccessFailedCount
      ) VALUES (
        @id,
        @userName,
        @normalizedUserName,
        @email,
        @normalizedEmail,
        1, -- EmailConfirmed
        @passwordHash,
        @securityStamp,
        @concurrencyStamp,
        0, -- PhoneNumberConfirmed
        0, -- TwoFactorEnabled
        0, -- LockoutEnabled
        0  -- AccessFailedCount
      )
    `;

    await request.query(query);

    res.status(201).json({ 
      message: 'User created successfully',
      userId: userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.number === 2601 || error.number === 2627) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    const errorMessage = error.originalError?.info?.message || error.message;
    res.status(500).json({ 
      error: 'Registration failed',
      details: errorMessage
    });
  }
});

// Login API Route
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Generate unique IDs and stamps
    const userId = uuidv4().toUpperCase();
    const normalizedEmail = email.toUpperCase();
    const normalizedUserName = username.toUpperCase();
    const securityStamp = uuidv4().toUpperCase();
    const concurrencyStamp = uuidv4().toUpperCase();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const request = new sql.Request(pool);
    request.input('id', sql.NVarChar(450), userId);
    request.input('userName', sql.NVarChar(256), username);
    request.input('normalizedUserName', sql.NVarChar(256), normalizedUserName);
    request.input('email', sql.NVarChar(256), email);
    request.input('normalizedEmail', sql.NVarChar(256), normalizedEmail);
    request.input('passwordHash', sql.NVarChar(sql.MAX), hashedPassword);
    request.input('securityStamp', sql.NVarChar(sql.MAX), securityStamp);
    request.input('concurrencyStamp', sql.NVarChar(sql.MAX), concurrencyStamp);

    const query = `
      INSERT INTO AspNetUsers (
        Id,
        UserName,
        NormalizedUserName,
        Email,
        NormalizedEmail,
        EmailConfirmed,
        PasswordHash,
        SecurityStamp,
        ConcurrencyStamp,
        PhoneNumberConfirmed,
        TwoFactorEnabled,
        LockoutEnabled,
        AccessFailedCount
      ) VALUES (
        @id,
        @userName,
        @normalizedUserName,
        @email,
        @normalizedEmail,
        1, -- EmailConfirmed
        @passwordHash,
        @securityStamp,
        @concurrencyStamp,
        0, -- PhoneNumberConfirmed
        0, -- TwoFactorEnabled
        0, -- LockoutEnabled
        0  -- AccessFailedCount
      )
    `;

    await request.query(query);

    res.status(201).json({ 
      message: 'User created successfully',
      userId: userId
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.number === 2601 || error.number === 2627) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    
    const errorMessage = error.originalError?.info?.message || error.message;
    res.status(500).json({ 
      error: 'Registration failed',
      details: errorMessage
    });
  }
});

// Login API Route
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1) Validate request body
    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich' });
    }

    // 2) Look up the user by email
    const request = new sql.Request(pool);
    request.input('email', sql.NVarChar(256), email);

    const result = await request.query(`
      SELECT TOP 1 *
      FROM AspNetUsers
      WHERE Email = @email
    `);

    if (result.recordset.length === 0) {
      // no such user
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const user = result.recordset[0];

    // 3) Verify password
    const isMatch = await bcrypt.compare(password, user.PasswordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    // 4) Determine admin status
    const isAdmin = user.Email === process.env.ADMIN_EMAIL;

    // 5) Sign a JWT
    const payload = { userId: user.Id, email: user.Email, isAdmin };
    const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 6) Respond with token + user info
    res.json({
      message: 'Anmeldung erfolgreich',
      token,               // <-- your JWT
      userId:   user.Id,
      username: user.UserName,
      email:    user.Email,
      isAdmin
    });

  } catch (error) {
    console.error("Login-Fehler:", error);
    res.status(500).json({ error: "Anmeldung fehlgeschlagen", details: error.message });
  }
});


app.get("/Product/GetProductEffects/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);
    const query = `
      SELECT 
        e.Id AS id, 
        e.Title AS title, 
        e.ImagePath AS imagePath
      FROM tblProductEffect pe
      INNER JOIN tblEffects e ON pe.EffectId = e.Id
      WHERE pe.ProductId = @id
    `;
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});


app.get("/Product/GetProductTerpenes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);
    const query = `
  SELECT 
    t.Id AS id, 
    t.Title AS title, 
    t.ImagePath AS imagePath
  FROM tblProductTerpene pt
  INNER JOIN tblTerpenes t ON pt.TerpeneId = t.Id
  WHERE pt.ProductId = @id
`;

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});

app.get("/Product/GetProductTastes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);
    const query = `
      SELECT 
        t.Id AS id, 
        t.Title AS title, 
        t.ImagePath AS imagePath
      FROM tblProductTaste pt
      INNER JOIN tblTastes t ON pt.TasteId = t.Id
      WHERE pt.ProductId = @id
    `;
    const result = await request.query(query);
    res.json(result.recordset);
  } catch (error) {
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error.message 
    });
  }
});

// Get a single Origin by ID
app.get("/Product/GetOriginById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const query = `
      SELECT 
        Id   AS id,
        Name AS name,
        ImagePath AS imagePath
      FROM tblOrigins
      WHERE Id = @id
    `;

    const result = await request.query(query);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Origin not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching origin:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// Get a single Ray by ID
app.get("/Product/GetRayById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const query = `
      SELECT 
        Id   AS id,
        Name AS name,
        ImagePath AS imagePath
      FROM tblRays
      WHERE Id = @id
    `;

    const result = await request.query(query);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Ray not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching ray:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

app.get("/Product/GetManufacturerById/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Looking up manufacturer id =", id);
    const request = new sql.Request(pool);
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`
      SELECT
        Id        AS id,
        Name      AS name,
        ImagePath AS imagePath
      FROM tblManufacturers
      WHERE Id = @id
    `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Error fetching manufacturer:", error);
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
});

// in server.js (or wherever your product routes live)

// Returns full pharmacy rows *with* the per‐product price
app.get("/Product/GetProductPharmacies/:id", async (req, res) => {
  const { id } = req.params;
  const request = new sql.Request(pool);
  request.input("id", sql.UniqueIdentifier, id);
  const query = `
    SELECT
      ph.Id          AS id,
      ph.Name        AS name,
      ph.Address     AS address,
      ph.IsVerified  AS isVerified,
      ph.Email       AS email,
      ph.Phone       AS phone,
      ph.ProfileUrl  AS profileUrl,
      ph.ImagePath   AS imagePath,
      ph.CoverImagePath AS coverImagePath,
      pph.Price      AS price
    FROM tblProductPharmacies pph
    JOIN tblPharmacies ph
      ON pph.PharmacyId = ph.Id
    WHERE pph.ProductId = @id
  `;
  const result = await request.query(query);
  res.json(result.recordset);
});

const pharmacyLogoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images/Pharmacy"));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});
const uploadPharmacyLogo = multer({ storage: pharmacyLogoStorage });

// And your upload route
app.post(
  "/upload/pharmacy-logo",
  uploadPharmacyLogo.single("file"),
  (req, res) => {
    console.log("== MULTER REQ.FILE ==", req.file);
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ filename: req.file.filename });
  }
);

app.get("/images/Pharmacy/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "public", "images", "Pharmacy", filename);

  // send the file, or a 404 if it doesn't exist
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Error sending pharmacy logo:", err);
      res.status(err.status || 404).json({ error: "Logo not found" });
    }
  });
});

// ── Articles List
app.get("/articles", async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        Id          AS id,
        Title       AS title,
        Content     AS content,
        URL         AS url,
        ImagePath   AS imagePath,
        Date        AS date,
        TagIds      AS tagIds
      FROM tblArticles
      ORDER BY Date DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching articles:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Single Article
app.get("/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`
      SELECT
        Id          AS id,
        Title       AS title,
        Content     AS content,
        URL         AS url,
        ImagePath   AS imagePath,
        Date        AS date,
        TagIds      AS tagIds
      FROM tblArticles
      WHERE Id = @id
    `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching article:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Carousel Items List
app.get("/carousel", async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        Id          AS id,
        Title       AS title,
        SubTitle    AS subTitle,
        Description AS description,
        ImagePath   AS imagePath
      FROM tblCarousels
      ORDER BY Title
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching carousel items:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Single Carousel Item
app.get("/carousel/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`
      SELECT
        Id          AS id,
        Title       AS title,
        SubTitle    AS subTitle,
        Description AS description,
        ImagePath   AS imagePath
      FROM tblCarousels
      WHERE Id = @id
    `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Carousel item not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching carousel item:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── All Thumbnails
app.get("/thumbnail", async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT
        Id          AS id,
        Title       AS title,
        SubTitle    AS subTitle,
        Description AS description,
        ImagePath   AS imagePath
      FROM tblThumbnails
      ORDER BY Title
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching thumbnail items:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Single Thumbnail Item
app.get("/thumbnail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = pool.request();
    request.input("id", sql.UniqueIdentifier, id);

    const result = await request.query(`
      SELECT
        Id          AS id,
        Title       AS title,
        SubTitle    AS subTitle,
        Description AS description,
        ImagePath   AS imagePath
      FROM tblThumbnails
      WHERE Id = @id
    `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Thumbnail item not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching thumbnail item:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Public Gallery List ──
// ── Public: list all galleries ────────────────────────────────────────────────
app.get("/gallery", async (req, res) => {
  try {
    const result = await global.pool.request().query(`
      SELECT
        Id             AS id,
        Title          AS title,
        SubTitle       AS subTitle,
      IsGrid         AS isGrid,
       IsSlide        AS isSlide,
        Description    AS description,
        ImagePath      AS imagePath,
        GridProductIds AS gridProductIds,
        SlideProductIds AS slideProductIds
      FROM tblGallery
      ORDER BY Title;
    `);

    const galleries = result.recordset.map(g => ({
      id:              g.id,
      title:           g.title,
      subTitle:        g.subTitle,
     isGrid:         !!g.isGrid,
    isSlide:        !!g.isSlide,
      description:     g.description,
      imagePath:       g.imagePath,
      gridProductIds:  JSON.parse(g.gridProductIds  || "[]"),
      slideProductIds: JSON.parse(g.slideProductIds || "[]")
    }));

    res.json(galleries);
  } catch (err) {
    console.error("Error fetching galleries:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ── Public: get one gallery by ID ──────────────────────────────
app.get("/gallery/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id             AS id,
          Title          AS title,
          SubTitle       AS subTitle,
        IsGrid         AS isGrid,
         IsSlide        AS isSlide,
          Description    AS description,
          ImagePath      AS imagePath,
          GridProductIds AS gridProductIds,
          SlideProductIds AS slideProductIds
        FROM tblGallery
        WHERE Id = @id;
      `);

    if (!result.recordset.length) {
      return res.status(404).json({ error: "Gallery not found" });
    }

    const g = result.recordset[0];
    res.json({
      id:              g.id,
      title:           g.title,
      subTitle:        g.subTitle,
     isGrid:         !!g.isGrid,
    isSlide:        !!g.isSlide,
      description:     g.description,
      imagePath:       g.imagePath,
      gridProductIds:  JSON.parse(g.gridProductIds  || "[]"),
      slideProductIds: JSON.parse(g.slideProductIds || "[]")
    });
  } catch (err) {
    console.error("Error fetching gallery:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/Gallery/:id", async (req, res) => {
  const { title, subTitle, isGrid, isSlide } = req.body;
  const { id } = req.params;

  try {
    await global.pool.request()
      .input('id', sql.UniqueIdentifier, id)
      .input('title', sql.NVarChar, title)
      .input('subTitle', sql.NVarChar, subTitle)
      .input('isGrid', sql.Bit, isGrid)
      .input('isSlide', sql.Bit, isSlide)
      .query(`
        UPDATE tblGallery
        SET
          Title = @title,
          SubTitle = @subTitle,
          isGrid = @isGrid,
          isSlide = @isSlide
        WHERE Id = @id
      `);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// ── All Effects
app.get("/effects", async (req, res) => {
  try {
    const result = await pool.request()
      .query(`SELECT Id AS id, Title AS title, ImagePath AS imagePath FROM tblEffects`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching effects:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── All Product→Effect links
app.get("/producteffects", async (req, res) => {
  try {
    const result = await pool.request()
      .query(`SELECT ProductId AS productId, EffectId AS effectId FROM tblProductEffect`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching productEffects:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── All Terpenes
app.get("/terpenes", async (req, res) => {
  try {
    const result = await pool.request()
      .query(`SELECT Id AS id, Title AS title, ImagePath AS imagePath FROM tblTerpenes`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching terpenes:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── All Product→Terpene links
app.get("/productterpenes", async (req, res) => {
  try {
    const result = await pool.request()
      .query(`SELECT ProductId AS productId, TerpeneId AS terpeneId FROM tblProductTerpene`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching productTerpenes:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── All Tastes
app.get("/tastes", async (req, res) => {
  try {
    const result = await pool.request()
      .query(`SELECT Id AS id, Title AS title, ImagePath AS imagePath FROM tblTastes`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching tastes:", err);
    res.status(500).json({ error: err.message });
  }
});

// ── All Product→Taste links
app.get("/producttastes", async (req, res) => {
  try {
    const result = await pool.request()
      .query(`SELECT ProductId AS productId, TasteId AS tasteId FROM tblProductTaste`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching productTastes:", err);
    res.status(500).json({ error: err.message });
  }
});
// server.js (somewhere before app.listen)

// List all partner logos

app.get("/api/partnerlogos", async (req, res) => {
  try {
    const result = await global.pool.request().query(`
      SELECT
        Id        AS id,
        ImagePath AS imagePath
      FROM tblPartnerLogos
      ORDER BY ImagePath           -- 01-*, 02-*, … keeps the drag-&-drop order
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching partner logos:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/images/PartnerLogos/:file", async (req, res) => {
  const wanted = req.params.file;
  const dir    = path.join(__dirname, "public/images/PartnerLogos");
  const full   = path.join(dir, wanted);

  try {
    await fs.access(full);               // Datei mit Prefix existiert
    return res.sendFile(full);
  } catch {
    // versuch’s ohne führende Nummer
    const fallback = path.join(dir, wanted.replace(/^\d+-/, ""));
    return res.sendFile(fallback, (err) => {
      if (err) res.status(404).end();
    });
  }
});

// Get a single partner logo
app.get("/api/partnerlogos/:id", async (req, res) => {
  try {
    const request = global.pool.request();
    request.input("id", sql.UniqueIdentifier, req.params.id);
    const result = await request.query(`
      SELECT
        Id        AS id,
        ImagePath AS imagePath
      FROM tblPartnerLogos
      WHERE Id = @id
    `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Logo not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching partner logo:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── ORIGINS ────────────────────────────────────────────────────────────────
// List all origins
app.get("/api/origins", async (req, res) => {
  try {
    const result = await pool
      .request()
      .query(`SELECT Id AS id, Name AS name, ImagePath AS imagePath
              FROM tblOrigins
              ORDER BY Name`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching origins:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Get a single origin by id
app.get("/api/origins/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT Id AS id, Name AS name, ImagePath AS imagePath
              FROM tblOrigins
              WHERE Id = @id`);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Origin not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching origin:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// ── Shop Descriptions ────────────────────────────────────────────────────
// List all shop descriptions
app.get("/api/shopdescriptions", async (req, res) => {
  try {
    const result = await pool
      .request()
      .query(`
        SELECT
          Id          AS id,
          Title       AS title,
          Description AS description,
          ImagePath   AS imagePath
        FROM tblShopDescriptions
        ORDER BY SortOrder
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching shop descriptions:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Get one shop description by id
app.get("/api/shopdescriptions/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id          AS id,
          Title       AS title,
          Description AS description,
          ImagePath   AS imagePath
        FROM tblShopDescriptions
        WHERE Id = @id
      `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Shop description not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching shop description:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});



// ── MANUFACTURERS ──────────────────────────────────────────────────────────
// List all manufacturers
app.get("/api/manufacturers", async (req, res) => {
  try {
    const result = await pool
      .request()
      .query(`SELECT Id AS id, Name AS name, ImagePath AS imagePath
              FROM tblManufacturers
              ORDER BY Name`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching manufacturers:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Get a single manufacturer by id
app.get("/api/manufacturers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT Id AS id, Name AS name, ImagePath AS imagePath
              FROM tblManufacturers
              WHERE Id = @id`);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Manufacturer not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching manufacturer:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});


// ── USERS ──────────────────────────────────────────────────────────────────
// List all users (admin only—attach authenticateAdmin if needed)
app.get("/api/users", authenticateAdmin, async (req, res) => {
  try {
    const result = await pool
      .request()
      .query(`SELECT 
                Id           AS id,
                UserName     AS userName,
                Email        AS email,
                EmailConfirmed,
                PhoneNumber,
                TwoFactorEnabled,
                LockoutEnabled
              FROM AspNetUsers
              ORDER BY UserName`);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Get a single user by id (admin only)
app.get("/api/users/:id", authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool
      .request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`SELECT *
              FROM AspNetUsers
              WHERE Id = @id`);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Public: list all sale products
app.get("/saleproducts", async (req, res) => {
  try {
    const result = await pool
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
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching sale products:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});

// Public: fetch one sale product by ID
app.get("/saleproducts/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool
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
    if (!result.recordset.length) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching sale product:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  }
});





// 1) serve the folder under /images/Articles
app.use(
  "/images/Articles",
  express.static(path.join(__dirname, "public/images/Articles"))
);

// 2) multer storage for article uploads
const articlesStorage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "public/images/Articles")),
  filename: (req, file, cb) => {
    // keep the same uuidv4 + ext logic
    const { v4: uuidv4 } = require("uuid");
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  }
});
const uploadArticlesImage = multer({ storage: articlesStorage });

// 3) upload route
app.post(
  "/upload/articles-image",
  uploadArticlesImage.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    // return the new filename so front-end can set form.imageFile
    res.json({ filename: req.file.filename });
  }
);

app.use(
  "/images/Carousel",
  express.static(path.join(__dirname, "public/images/Carousel"))
);

// 2) multer storage + upload route (if you still want a standalone upload)
const carouselStorage = multer.diskStorage({
  destination: (req, file, cb) =>
    cb(null, path.join(__dirname, "public/images/Carousel")),
  filename: (req, file, cb) =>
    cb(null, uuidv4() + path.extname(file.originalname))
});
const uploadCarouselImage = multer({ storage: carouselStorage });

app.post(
  "/upload/carousel-image",
  uploadCarouselImage.single("file"),
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ filename: req.file.filename });
  }
);

app.get('/debug/env', (req, res) => {
  res.json({
    DB_SERVER:   process.env.DB_SERVER,
    DB_NAME:     process.env.DB_NAME,
    DB_USER:     process.env.DB_USER,
    DB_PORT:     process.env.DB_PORT,
    PORT:        process.env.PORT
  });
});



app.use(
  "/images/Products",
  express.static(path.join(__dirname, "public/images/Products"))
);
app.use(
  "/images/Pharmacy",
  express.static(path.join(__dirname, "public/images/Pharmacy"))
);
app.use(
  "/images/GrowEquipments",
  express.static(path.join(__dirname, "public/images/GrowEquipments"))
);
app.use(
  "/images/CBDShops",
  express.static(path.join(__dirname, "public/images/CBDShops"))
);
app.use(
  "/images/HeadShops",
  express.static(path.join(__dirname, "public/images/HeadShops"))
);
app.use(
  "/images/Doctors",
  express.static(path.join(__dirname, "public/images/Doctors"))
);
app.use(
  "/images/Carousel",
  express.static(path.join(__dirname, "public/images/Carousel"))
);
app.use(
  "/images/Thumbnail",
  express.static(path.join(__dirname, "public/images/Thumbnail"))
);
app.use(
  "/images/Gallery",
  express.static(path.join(__dirname, "public/images/Gallery"))
);
app.use(
  "/images/Manufacturer",
  express.static(path.join(__dirname, "public/images/Manufacturer"))
);
app.use(
  "/images/PartnerLogos",
  express.static(path.join(__dirname, "public/images/PartnerLogos"))
);
app.use(
  "/images/ShopDescriptions",
  express.static(path.join(__dirname, "public/images/ShopDescriptions"))
);
app.use(
  "/images/Origins",
  express.static(path.join(__dirname, "public/images/Origins"))
);

function authenticateAdmin(req, res, next) {
  // 1) Check for x-admin-key first
  const adminKeyHeader = req.headers['x-admin-key'];
  if (adminKeyHeader && adminKeyHeader === process.env.ADMIN_KEY) {
    return next();
  }

  // 2) Fallback to JWT-based auth
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.slice(7);
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    if (payload.email !== process.env.ADMIN_EMAIL) {
      return res.status(403).json({ error: 'Forbidden: admin only' });
    }
    req.user = payload;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('API ist live und lauscht!');
});

const adminProductsRoutes       = require('./admin/Products/adminProductsRoutes');
const adminDoctorsRoutes        = require('./admin/Doctors/adminDoctorsRoutes');
const adminPharmaciesRoutes     = require('./admin/Pharmacies/adminPharmaciesRoutes');
const adminCBDShopsRoutes       = require('./admin/CBDShops/adminCBDShopsRoutes');
const adminGrowEquipmentsRoutes = require('./admin/GrowEquipments/adminGrowEquipmentsRoutes');
const adminHeadShopsRoutes      = require('./admin/HeadShops/adminHeadShopsRoutes');
const adminArticlesRoutes       = require('./admin/Articles/adminArticlesRoutes');
const adminCarouselRoutes       = require('./admin/Carousel/adminCarouselRoutes');
const adminThumbnailRoutes      = require('./admin/Thumbnail/adminThumbnailRoutes');
const adminGalleryRoutes        = require('./admin/Gallery/adminGalleryRoutes');
const partnerLogosRoutes        = require('./admin/PartnerLogos/adminPartnerLogosRoutes');
const adminShopDescriptionsRoutes = require('./admin/ShopDescriptions/adminShopDescriptionsRoutes');
const adminManufacturersRoutes   = require('./admin/Manufacturers/adminManufacturersRoutes');
const adminOriginsRoutes         = require('./admin/Origins/adminOriginsRoutes');
const adminSaleProductsRoutes    = require('./admin/SaleProducts/adminSaleProductsRoutes');
const adminUsersRoutes           = require('./admin/Users/adminUsersRoutes');


app.use('/Products',          authenticateAdmin, adminProductsRoutes);
app.use('/Doctors',           authenticateAdmin, adminDoctorsRoutes);
app.use('/Pharmacies',        authenticateAdmin, adminPharmaciesRoutes);
app.use('/CBDShops',          authenticateAdmin, adminCBDShopsRoutes);
app.use('/GrowEquipments',    authenticateAdmin, adminGrowEquipmentsRoutes);
app.use('/HeadShops',         authenticateAdmin, adminHeadShopsRoutes);
app.use('/Articles',          authenticateAdmin, adminArticlesRoutes);
app.use('/Carousel',          authenticateAdmin, adminCarouselRoutes);
app.use('/Thumbnail',         authenticateAdmin, adminThumbnailRoutes);
app.use('/Gallery',           authenticateAdmin, adminGalleryRoutes);
app.use('/PartnerLogos',      authenticateAdmin, partnerLogosRoutes);
app.use('/api/shopdescriptions',   authenticateAdmin, adminShopDescriptionsRoutes);
app.use('/Manufacturers',     authenticateAdmin, adminManufacturersRoutes);
app.use('/Origins',           authenticateAdmin, adminOriginsRoutes);
app.use('/SaleProducts',      authenticateAdmin, adminSaleProductsRoutes);
app.use('/Users',             authenticateAdmin, adminUsersRoutes);



app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
