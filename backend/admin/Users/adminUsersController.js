const sql        = require("mssql");
const bcrypt     = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const saltRounds = 10;

// GET /Users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await global.pool.request().query(`
      SELECT
        Id               AS id,
        UserName         AS userName,
        Email            AS email,
        EmailConfirmed   AS emailConfirmed,
        PhoneNumber      AS phoneNumber,
        TwoFactorEnabled AS twoFactorEnabled,
        LockoutEnabled   AS lockoutEnabled,
        IsAdmin          AS isAdmin
      FROM AspNetUsers
      ORDER BY UserName
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// GET /Users/:id
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`
        SELECT
          Id               AS id,
          UserName         AS userName,
          Email            AS email,
          EmailConfirmed   AS emailConfirmed,
          PhoneNumber      AS phoneNumber,
          TwoFactorEnabled AS twoFactorEnabled,
          LockoutEnabled   AS lockoutEnabled,
          IsAdmin          AS isAdmin
        FROM AspNetUsers
        WHERE Id = @id
      `);
    if (!result.recordset.length) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(result.recordset[0]);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// POST /Users
exports.createUser = async (req, res) => {
  try {
    const { userName, email, password, isAdmin } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ error: "Username, email and password are required" });
    }

    const id               = uuidv4().toUpperCase();
    const normalizedUser   = userName.toUpperCase();
    const normalizedEmail  = email.toUpperCase();
    const passwordHash     = await bcrypt.hash(password, saltRounds);
    const securityStamp    = uuidv4().toUpperCase();
    const concurrencyStamp = uuidv4().toUpperCase();

    await global.pool.request()
      .input("id",                 sql.NVarChar(450),    id)
      .input("userName",           sql.NVarChar(256),    userName)
      .input("normalizedUserName", sql.NVarChar(256),    normalizedUser)
      .input("email",              sql.NVarChar(256),    email)
      .input("normalizedEmail",    sql.NVarChar(256),    normalizedEmail)
      .input("passwordHash",       sql.NVarChar(sql.MAX),passwordHash)
      .input("securityStamp",      sql.NVarChar(sql.MAX),securityStamp)
      .input("concurrencyStamp",   sql.NVarChar(sql.MAX),concurrencyStamp)
      .input("isAdmin",            sql.Bit,              isAdmin ? 1 : 0)
      .query(`
        INSERT INTO AspNetUsers (
          Id, UserName, NormalizedUserName,
          Email, NormalizedEmail, EmailConfirmed,
          PasswordHash, SecurityStamp, ConcurrencyStamp,
          PhoneNumberConfirmed, TwoFactorEnabled,
          LockoutEnabled, AccessFailedCount,
          IsAdmin
        ) VALUES (
          @id, @userName, @normalizedUserName,
          @email, @normalizedEmail, 1,
          @passwordHash, @securityStamp, @concurrencyStamp,
          0, 0, 0, 0, @isAdmin
        )
      `);

    res.status(201).json({ message: "User created", userId: id });
  } catch (err) {
    console.error("Error creating user:", err);
    if (err.number === 2627) {
      return res.status(409).json({ error: "User or email already exists" });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// PUT /Users/:id
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      userName,
      email,
      password,
      emailConfirmed,
      phoneNumber,
      twoFactorEnabled,
      lockoutEnabled,
      isAdmin,
    } = req.body;

    const normalizedUser  = userName.toUpperCase();
    const normalizedEmail = email.toUpperCase();

    const reqt = global.pool.request()
      .input("id",                 sql.UniqueIdentifier, id)
      .input("userName",           sql.NVarChar(256),    userName)
      .input("normalizedUserName", sql.NVarChar(256),    normalizedUser)
      .input("email",              sql.NVarChar(256),    email)
      .input("normalizedEmail",    sql.NVarChar(256),    normalizedEmail)
      .input("emailConfirmed",     sql.Bit,               emailConfirmed ? 1 : 0)
      .input("phoneNumber",        sql.NVarChar(50),      phoneNumber || "")
      .input("twoFactorEnabled",   sql.Bit,               twoFactorEnabled ? 1 : 0)
      .input("lockoutEnabled",     sql.Bit,               lockoutEnabled ? 1 : 0)
      .input("isAdmin",            sql.Bit,               isAdmin ? 1 : 0);

    let setClause = `
      UserName = @userName,
      NormalizedUserName = @normalizedUserName,
      Email = @email,
      NormalizedEmail = @normalizedEmail,
      EmailConfirmed = @emailConfirmed,
      PhoneNumber = @phoneNumber,
      TwoFactorEnabled = @twoFactorEnabled,
      LockoutEnabled = @lockoutEnabled,
      IsAdmin = @isAdmin
    `;

    if (password) {
      const hash = await bcrypt.hash(password, saltRounds);
      reqt.input("passwordHash", sql.NVarChar(sql.MAX), hash);
      setClause += `, PasswordHash = @passwordHash`;
    }

    const result = await reqt.query(`
      UPDATE AspNetUsers
      SET ${setClause}
      WHERE Id = @id
    `);

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// DELETE /Users/:id
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await global.pool.request()
      .input("id", sql.UniqueIdentifier, id)
      .query(`DELETE FROM AspNetUsers WHERE Id = @id`);
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
