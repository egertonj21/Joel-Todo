const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Middleware
app.use(cors());  // Enable CORS
app.use(bodyParser.json());

// Database connection
const db = mysql.createConnection({
  host: "192.168.0.93",
  user: "root", // Replace with your DB usernames
  password: "5Hitstain!", // Replace with your DB password
  database: "ToDoJoel", // Your database name
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to the database.");
});

// Routes

// Get all categories
app.get("/categories", (req, res) => {
  db.query("SELECT * FROM category", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a new category
app.post("/categories", (req, res) => {
  const { category_description } = req.body;
  db.query(
    "INSERT INTO category (category_description) VALUES (?)",
    [category_description],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: results.insertId, category_description });
    }
  );
});

// Get all priorities
app.get("/priorities", (req, res) => {
  db.query("SELECT * FROM priority", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Get all tasks
app.get("/tasks", (req, res) => {
  db.query(
    `SELECT t.task_id, t.task_name, t.task_added, t.task_completed,
            c.category_description, p.priority_description
     FROM tasks t
     JOIN category c ON t.category_id = c.category_id
     JOIN priority p ON t.priority_id = p.priority_id`,
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Add a new task
app.post("/tasks", (req, res) => {
    const { task_name, category_id, priority_id, task_completed } = req.body;
    db.query(
      `INSERT INTO tasks (task_name, category_id, priority_id, task_added, task_completed)
       VALUES (?, ?, ?, NOW(), ?)`,
      [task_name, category_id, priority_id, task_completed],
      (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: results.insertId, task_name });
      }
    );
  });


// Update a task (e.g., mark as completed)
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;  // Get the task ID from the URL parameter
    console.log(`Updating task with ID: ${id}`);

    db.query(
        `UPDATE tasks SET task_completed = NOW() WHERE task_id = ?`,  // Only updating task_completed
        [id],  // Only passing the task ID to update
        (err, results) => {
            if (err) {
                console.error("Database query error:", err); // Log the database error
                return res.status(500).json({ error: err.message });
            }
            if (results.affectedRows === 0) {
                console.log("No task found with the given ID");
                return res.status(404).json({ error: "Task not found" });
            }
            console.log("Task updated successfully");
            res.json({ message: "Task updated successfully" });
        }
    );
});



// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tasks WHERE task_id = ?", [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.affectedRows === 0)
      return res.status(404).json({ error: "Task not found" });
    res.json({ message: "Task deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
