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

// ✅ Query function with connection validation + retry
export async function query(sql, params = []) {
  let connection;

  const getConnectionWithTimeout = async () => {
    return await Promise.race([
      pool.getConnection(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("DB connection timeout")), 5000),
      ),
    ]);
  };

  try {
    connection = await getConnectionWithTimeout();

    // 🔥 validate connection before using it
    try {
      await connection.ping();
    } catch (pingError) {
      console.log("Dead MySQL connection detected, recreating...");

      connection.destroy();

      connection = await getConnectionWithTimeout();

      await connection.ping();
    }

    const [results] = await connection.execute(sql, params);

    return results;
  } catch (error) {
    console.error("Database query error:", error.code, error.message);

    // 🔁 retry once for connection problems
    if (
      error.code === "PROTOCOL_CONNECTION_LOST" ||
      error.code === "ECONNRESET" ||
      error.code === "ETIMEDOUT" ||
      error.code === "EPIPE" ||
      error.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR"
    ) {
      console.log("Retrying database query...");

      let retryConnection;

      try {
        retryConnection = await getConnectionWithTimeout();

        await retryConnection.ping();

        const [results] = await retryConnection.execute(sql, params);

        return results;
      } catch (retryError) {
        console.error("Retry failed:", retryError.code, retryError.message);

        throw retryError;
      } finally {
        if (retryConnection) {
          retryConnection.release();
        }
      }
    }

    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Optional: direct pool export
export default pool;
