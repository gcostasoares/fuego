require("dotenv").config();
const sql = require("mssql");

const dbConfig = {
    user: "SA",
    password: "YourStrong@Passw0rd",
    server: "localhost",
    port: 1433,  // Explicitly set SQL Server port
    database: "Fuego",
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

async function testConnection() {
    try {
        console.log("🔄 Testing database connection...");
        await sql.connect(dbConfig);
        console.log("✅ Connected to database!");

        // Run a simple query to check connectivity
        const result = await sql.query("SELECT COUNT(*) AS productCount FROM tblProducts");
        console.log("📊 Product Count:", result.recordset);

        sql.close();
    } catch (err) {
        console.error("❌ Database connection failed:", err.message);
    }
}

testConnection();
