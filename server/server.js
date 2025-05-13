const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

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

// Serve static files (for audio files)
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Data directory setup
const dataDir = path.join(__dirname, 'data');
const assetsDir = path.join(__dirname, 'assets');

// Ensure directories exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// API endpoint to get list of available books
app.get('/api/books', (req, res) => {
  try {
    const books = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.json'))
      .map(file => {
        return {
          id: file.replace('.json', ''),
          title: file.replace('.json', '').split('-').join(' ')
        };
      });
    
    res.json({ books });
  } catch (error) {
    console.error('Error reading books directory:', error);
    res.status(500).json({ error: 'Failed to fetch books list' });
  }
});

// API endpoint to get a specific book's timestamp data
app.get('/api/book/:bookId/timestamps', (req, res) => {
  const { bookId } = req.params;
  const filePath = path.join(dataDir, `${bookId}.json`);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      res.json(JSON.parse(data));
    } else {
      res.status(404).json({ error: `Book ${bookId} not found` });
    }
  } catch (error) {
    console.error(`Error reading book data for ${bookId}:`, error);
    res.status(500).json({ error: 'Failed to fetch book data' });
  }
});

// API endpoint to stream audio file
app.get('/api/book/:bookId/audio', (req, res) => {
  const { bookId } = req.params;
  const audioPath = path.join(assetsDir, `${bookId}.wav`);
  
  try {
    if (fs.existsSync(audioPath)) {
      res.sendFile(audioPath);
    } else {
      res.status(404).json({ error: `Audio for ${bookId} not found` });
    }
  } catch (error) {
    console.error(`Error sending audio file for ${bookId}:`, error);
    res.status(500).json({ error: 'Failed to stream audio file' });
  }
});

// API endpoint to get book image
app.get('/api/book/:bookId/image', (req, res) => {
  const { bookId } = req.params;
  // Check for different image formats
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
  
  for (const ext of imageExtensions) {
    const imagePath = path.join(assetsDir, `${bookId}${ext}`);
    if (fs.existsSync(imagePath)) {
      return res.sendFile(imagePath);
    }
  }
  
  res.status(404).json({ error: `Image for ${bookId} not found` });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
  console.log(`Data directory: ${dataDir}`);
  console.log(`Assets directory: ${assetsDir}`);
});