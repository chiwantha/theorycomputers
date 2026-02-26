import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "seo_blog_2025",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: "+00:00",
  charset: "utf8mb4_unicode_ci",
  connectTimeout: 10000,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);

// Utility function to execute queries
export async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  }
}

// Utility to format dates for MySQL
export function formatDate(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

export default pool;
