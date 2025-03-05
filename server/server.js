const express = require("express");
const cors = require("cors");
const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // This should match your React app's port
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello from server!" });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});