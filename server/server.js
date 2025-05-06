const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');

const app = express();

// Configure CORS with specific options
app.use(cors({
  origin: 'http://localhost:5173', // This should match your React app's port
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Potential TO-DO in future:
// Fetch whisper transcriptions from some database and send them to the client



const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});