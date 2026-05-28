require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());

// DB connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, 
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432
});

// safer DB init with retry
const initDB = async () => {
  let connected = false;

  for (let i = 0; i < 10; i++) {
    try {
      await pool.query("SELECT 1");

      await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          name TEXT,
          email TEXT
        )
      `);

      console.log(" DB connected & table ready");
      connected = true;
      break;

    } catch (err) {
      console.log(" Waiting for DB...");
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  if (!connected) {
    throw new Error(" Database connection failed");
  }
};

initDB();

// INSERT
app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  const result = await pool.query(
    "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );

  res.json(result.rows[0]);
});

// GET
app.get("/users", async (req, res) => {
  const result = await pool.query("SELECT * FROM users");
  res.json(result.rows);
});

app.listen(PORT, () => {
  console.log(" Backend running on port 3000");
});
