import mysql from "mysql2/promise";

// DB Config
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "seo_blog_2025",

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  timezone: "+00:00",
  charset: "utf8mb4",

  connectTimeout: 10000,

  enableKeepAlive: true,
  keepAliveInitialDelay: 10000,

  // add these
  idleTimeout: 60000,
  maxIdle: 5,
};

// 🔥 Singleton (VERY IMPORTANT for Next.js)
let pool;

if (!global._mysqlPool) {
  global._mysqlPool = mysql.createPool(dbConfig);
}

pool = global._mysqlPool;

// ✅ Query function with retry + safe connection handling
export async function query(sql, params = []) {
  let connection;

  try {
    connection = await pool.getConnection();

    const [results] = await connection.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);

    // 🔁 Retry once for connection-related errors
    if (
      error.code === "PROTOCOL_CONNECTION_LOST" ||
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT"
    ) {
      try {
        console.log("Retrying database query...");

        const [results] = await pool.execute(sql, params);
        return results;
      } catch (retryError) {
        console.error("Retry failed:", retryError);
        throw retryError;
      }
    }

    throw error;
  } finally {
    if (connection) connection.release();
  }
}

// Optional: direct pool export
export default pool;
