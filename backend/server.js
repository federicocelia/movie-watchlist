require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.OMDB_API_KEY;

if (!API_KEY) {
  console.error("OMDB_API_KEY missing from .env");
  process.exit(1);
}

app.get("/api/omdb", async (req, res) => {
  try {
    const params = new URLSearchParams({
      ...req.query,
      apikey: API_KEY,
    });

    const response = await fetch(`https://www.omdbapi.com/?${params}`);

    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch data from OMDb",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
