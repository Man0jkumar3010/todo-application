require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const { Client } = require("pg");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5001;

const client = new Client({
  host: "localhost",
  user: "postgres",
  password: "@Admin1234",
  port: 5432,
  database: "todo",
});

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

const connectDatabase = async () => {
  try {
    await client.connect();
    console.log("Database connected Successfully...!");
  } catch (error) {
    console.log("Database not connected:", error.message);
  }
};

const connectServer = async () => {
  await connectDatabase();
  app.listen(port, () => {
    console.log("Server running on:", port);
  });
};

connectServer();

const secretKey = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  console.log("Request Headers:", req.headers);
  const token = req.cookies.Token;
  if (token) {
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).send({ message: "User is unauthorized" });
      } 
      req.user = user;
      next();
    });
  } else {
    return res.status(401).send({ message: "No token provided" });
  }
};

app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send({ message: "All fields are mandatory!" });
  }
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res
        .status(409)
        .send({ message: "User already exists with this email" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("HasheddP ====>", hashedPassword);

    await client.query(
      "INSERT INTO users (name, email,password) VALUES ($1, $2, $3)",
      [name, email, hashedPassword]
    );
    res.status(201).send({ message: "User created successfully!" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "Registration error" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await client.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    console.log("Result ===>", result);

    const user = result.rows[0];
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ email: user.email }, secretKey, {
        expiresIn: "1h",
      });

      console.log("request cookie", req.cookies);

      res.cookie("Token", token, { maxAge: 3600000 });
      res.status(200).json({ message: "Cookie set!" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).send({ message: "User not logged in" });
  }
});

app.post("/api/logout",(req, res) => {
  res.clearCookie("Token");
  res.status(200).send({ message: "Logged out successfully" });
});

app.get("/api/todos", authenticateToken, async (req, res) => {
  try {
    const userEmail = req.user.email;
    const result = await client.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [userEmail]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).send("Error fetching todos");
  }
});

app.post("/api/todos", authenticateToken, async (req, res) => {
  const { id, text, isComplete } = req.body;
  console.log("req.user ===>", req.user.email);

  const userEmail = req.user.email;
  try {
    await client.query(
      "INSERT INTO todos (id, text, isComplete, user_email) VALUES ($1, $2, $3, $4)",
      [id, text, isComplete, userEmail]
    );
    res.status(201).send("Todo added");
  } catch (error) {
    res.status(500).send("Error adding todo");
  }
});

app.delete("/api/todos/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const userEmail = req.user.email;
  try {
    await client.query("DELETE FROM todos WHERE id = $1 AND user_email = $2", [
      id,
      userEmail,
    ]);
    res.send("Todo deleted");
  } catch (error) {
    res.status(500).send("Error deleting todo");
  }
});

app.put("/api/todos/:id", authenticateToken, async (req, res) => {
  const id = req.params.id;
  const { text, isComplete } = req.body;
  const userEmail = req.user.email;
  try {
    await client.query(
      "UPDATE todos SET text = $1, isComplete = $2 WHERE id = $3 AND user_email = $4",
      [text, isComplete, id, userEmail]
    );
    res.send("Todo updated");
  } catch (error) {
    res.status(500).send("Error updating todo");
  }
});
