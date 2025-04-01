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

// dumb api code, get rid of in future
const dummy = {}
const requestBody = {
  "audioConfig": {
    "audioEncoding": "LINEAR16",
    "effectsProfileId": [
      "small-bluetooth-speaker-class-device"
    ],
    "pitch": 0,
    "speakingRate": 1
  },
  "input": {
    "text": "Movies, oh my gosh, I just just absolutely love them. They're like time machines taking you to different worlds and landscapes, and um, and I just can't get enough of it."
  },
  "voice": {
    "languageCode": "en-US",
    "name": "en-US-Chirp-HD-F"
  }
}

app.post("/api/voice", (req, res) => {
  console.log('we are here')
  fetch("https://texttospeech.googleapis.com/v1beta1/text:synthesize", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.content),
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
  })
  .then(data => res.json(data))
  .catch(error => console.error(error));
})


const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});