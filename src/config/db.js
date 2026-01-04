require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASS),
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

console.log("🚀 Aplicação conectada ao PostgreSQL com êxito! ");
module.exports = pool;
