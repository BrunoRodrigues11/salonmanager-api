require("dotenv").config();
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false
        }
      }
    : {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: Number(process.env.DB_PORT),
      }
);

// Teste REAL de conexão
pool.query("SELECT 1")
  .then(() => console.log("✅ PostgreSQL conectado"))
  .catch(err => console.error("❌ Erro ao conectar no PostgreSQL", err));

module.exports = pool;
