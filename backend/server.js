const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;
const { Pool } = require("pg");
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
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  pool
    .query(query)
    .then((result) => {
      console.log("Query executed:", query);
      console.log("Result rows:", result.rows);

      const responseData = {
        message: "Query executed successfully",
        data: result.rows, // Adjust this based on what data you want to expose
      };
      res.json(responseData);
    })
    .catch((err) => {
      console.error("Error executing query", err.stack);
      res
        .status(500)
        .json({ message: "Internal Server Error", error: err.message });
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
