const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parse JSON body

// Serve static frontend from /public
app.use(express.static(path.join(__dirname, "public")));

// In-memory data
let goals = [
  { id: 1, title: "Learn Express" },
  { id: 2, title: "Build a CRUD API" },
];

// Health check
app.get("/api/greet", (req, res) => {
  res.json({ message: "Hello from Node.js API!" });
});

// CRUD routes
function registerGoalRoutes(basePath) {
  // GET all
  app.get(`${basePath}`, (req, res) => {
    res.json(goals);
  });

  // POST new
  app.post(`${basePath}`, (req, res) => {
    const newGoal = { id: Date.now(), ...req.body };
    goals.push(newGoal);
    res.status(201).json(newGoal);
  });

  // PUT update by id
  app.put(`${basePath}/:id`, (req, res) => {
    const id = parseInt(req.params.id, 10);
    const index = goals.findIndex((g) => g.id === id);

    if (index !== -1) {
      goals[index] = { ...goals[index], ...req.body };
      res.json(goals[index]);
    } else {
      res.status(404).json({ error: "Goal not found" });
    }
  });

  // DELETE by id
  app.delete(`${basePath}/:id`, (req, res) => {
    const id = parseInt(req.params.id, 10);
    goals = goals.filter((g) => g.id !== id);
    res.json({ message: "Deleted successfully" });
  });
}

registerGoalRoutes("/goals");
registerGoalRoutes("/api/goals");

// Homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
