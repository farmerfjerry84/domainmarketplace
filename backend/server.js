const express = require("express");
const cors = require("cors");
const path = require("path");
const { loadListingsHealed } = require("./reflection");

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "NovaDomains API" });
});

// Listings (self‑healing)
app.get("/api/listings", (req, res) => {
  const listings = loadListingsHealed();
  res.json(listings);
});

// Serve frontend

app.use(express.static(path.join(__dirname, "..", "frontend")));
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`NovaDomains API running on ${PORT}`));
