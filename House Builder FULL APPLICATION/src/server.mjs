// src/server.mjs
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Controllers
import { CompanyController } from "./controllers/CompanyController.mjs";
import { PricingCatalogueController } from "./controllers/PricingCatalogueController.mjs";
import { ShowcaseController } from "./controllers/ShowcaseController.mjs";


// ----------------------------
// Setup __dirname for ES modules
// ----------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ----------------------------
// Express App
// ----------------------------
const app = express();
const PORT = 3000;

// ----------------------------
// Middleware
// ----------------------------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // serve CSS, JS, images, etc.

// Set EJS as the template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "public/views"));

// ----------------------------
// In-memory House Model (CRUD)
// ----------------------------
const houses = [];
let nextHouseId = 1;

// --- House API Routes ---
app.get("/api/houses", (req, res) => res.json(houses));

app.get("/api/houses/:id", (req, res) => {
  const house = houses.find(h => h.id === parseInt(req.params.id));
  if (!house) return res.status(404).json({ error: "House not found" });
  res.json(house);
});

app.post("/api/houses", (req, res) => {
  const house = { id: nextHouseId++, ...req.body };
  houses.push(house);
  res.status(201).json(house);
});

app.put("/api/houses/:id", (req, res) => {
  const idx = houses.findIndex(h => h.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "House not found" });
  houses[idx] = { ...houses[idx], ...req.body };
  res.json(houses[idx]);
});

app.delete("/api/houses/:id", (req, res) => {
  const idx = houses.findIndex(h => h.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: "House not found" });
  houses.splice(idx, 1);
  res.status(204).end();
});

// HOUSE FRONTEND PAGES
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/views/HouseList.html"))
);
app.get("/builder", (req, res) =>
  res.sendFile(path.join(__dirname, "public/views/HouseBuilder.html"))
);
app.get("/showcase", (req, res) =>
  res.sendFile(path.join(__dirname, "public/views/showcase.html"))
);

// Company Routes (Read-only)
app.get("/companies", CompanyController.CompanyList); // HTML page
app.get("/api/companies", CompanyController.getCompanyListJSON); // JSON all
app.get("/api/companies/:name", CompanyController.getCompanyByNameJSON); // JSON single

// Pricing catalogue API routes
app.get("/api/pricing", PricingCatalogueController.getPricingCatalogue); // Get full pricing catalogue

app.get("/api/pricing/extras/:extraName", PricingCatalogueController.getExtraPrice); // Get price of a single extra - Connects to 3 things 

//const extraName = req.params.extraName; reads the value from the URL and stores it in a variable.

// Showcase API routes (CRUD)
app.get("/api/showcase", ShowcaseController.getShowcaseJSON);
app.post("/api/showcase", ShowcaseController.publishBuild);
app.put("/api/showcase/:id", ShowcaseController.updateBuild);   // update a build
app.delete("/api/showcase/:id", ShowcaseController.deleteBuild); // delete a build

// Company Routes (Read-only)
app.get("/companies", CompanyController.CompanyList);                    // HTML page for companies
app.get("/api/companies", CompanyController.getCompanyListJSON);         // JSON: all companies
app.get("/api/companies/:name", CompanyController.getCompanyByNameJSON); // JSON: single company by name


// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});