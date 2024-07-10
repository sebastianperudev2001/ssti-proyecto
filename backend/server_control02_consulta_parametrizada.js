const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
const port = 3001;
const pool = new Pool({
  user: "user_test",
  host: "localhost",
  database: "ssti_database",
  password: "mypassword123",
  port: 5432, // PostgreSQL default port
});
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database");
  release();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.post("/login", async (req, res) => {
  let { username, password } = req.body;
  try {
    // Use parameterized query to prevent SQL injection
    const query = "SELECT * FROM users WHERE username = $1 AND password = $2";
    const values = [username, password];
    const result = await pool.query(query, values);
    console.log("Query executed:", query);
    console.log("Result rows:", result.rows);

    const responseData = {
      message: "Query executed successfully",
      data: result.rows,
    };

    res.json(responseData);
  } catch (err) {
    console.error("Error executing query", err.stack);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
