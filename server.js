// server.js
const express = require("express");
const path = require("path");
const pool = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Rutas
app.get("/", (req, res) => res.redirect("/places"));

app.get("/places", async (req, res) => {
  const result = await pool.query("SELECT * FROM places ORDER BY id DESC");
  res.render("index", { places: result.rows });
});

app.get("/places/new", (req, res) => {
  res.render("new");
});

app.post("/places", async (req, res) => {
  const { name, location, description, media_url, map_embed } = req.body;
  await pool.query(
    "INSERT INTO places (name, location, description, media_url, map_embed) VALUES ($1, $2, $3, $4, $5)",
    [name, location, description, media_url, map_embed]
  );
  res.redirect("/places");
});

app.get("/places/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM places WHERE id = $1", [
    req.params.id,
  ]);
  res.render("show", { place: result.rows[0] });
});

app.get("/places/edit/:id", async (req, res) => {
  const result = await pool.query("SELECT * FROM places WHERE id = $1", [
    req.params.id,
  ]);
  res.render("edit", { place: result.rows[0] });
});

app.post("/places/edit/:id", async (req, res) => {
  const { name, location, description, media_url, map_embed } = req.body;
  await pool.query(
    "UPDATE places SET name = $1, location = $2, description = $3, media_url = $4, map_embed = $5 WHERE id = $6",
    [name, location, description, media_url, map_embed, req.params.id]
  );
  res.redirect("/places");
});

app.post("/places/delete/:id", async (req, res) => {
  await pool.query("DELETE FROM places WHERE id = $1", [req.params.id]);
  res.redirect("/places");
});

// Iniciar servidor
app.listen(PORT, "192.168.100.56", () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
