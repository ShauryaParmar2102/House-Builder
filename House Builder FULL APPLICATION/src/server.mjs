// src/server.mjs
import express from "express"; //express creates the web server
import cors from "cors"; //cors allows frontend (different origin) to talk to backend
import path from "path"; //path helps build file paths safely
import { fileURLToPath } from "url"; //fileURLToPath fixes ES module limitation for __dirname

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

// Frontend Pages
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
app.get("/companies", CompanyController.CompanyList); // Returns HTML page for company list
app.get("/api/companies", CompanyController.getCompanyListJSON); // Returns all companies as JSON (used for dropdowns)
app.get("/api/companies/:name", CompanyController.getCompanyByNameJSON); // Returns a single company by name

// Pricing catalogue API routes
app.get("/api/pricing", PricingCatalogueController.getPricingCatalogue); // Returns full pricing catalogue (used for cost + extras UI)

app.get("/api/pricing/extras/:extraName", PricingCatalogueController.getExtraPrice); // Returns price of a single extra item by name

//const extraName = req.params.extraName; reads the value from the URL and stores it in a variable.

// Showcase API routes (CRUD)
app.get("/api/showcase", ShowcaseController.getShowcaseJSON); // Returns all showcase builds
app.post("/api/showcase", ShowcaseController.publishBuild); // Creates a new showcase build
app.put("/api/showcase/:id", ShowcaseController.updateBuild);  // Updates an existing showcase build by ID
app.delete("/api/showcase/:id", ShowcaseController.deleteBuild); // Deletes a showcase build by ID

// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});