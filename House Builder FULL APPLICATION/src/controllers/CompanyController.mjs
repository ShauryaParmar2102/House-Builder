// src/controllers/CompanyController.mjs
import { CompanyModel } from "../models/CompanyModel.mjs";

//Creates a controller class to handle requests and responses from the backend
export class CompanyController {
  // Handles request for HTML page 
  static async CompanyList(req, res) {
    try {
      //Gets all companies from the model 
      const companies = await CompanyModel.getAll();
      //Sends a HTML page using an EJS template and passes the company data into the page
      res.render("companyList.ejs", { companies }); // companylist.ejs has to exist
      //Error handling: log the error if something breaks or send a 500 server error message
    } catch (err) {
      console.error(err);
      res.status(500).send("Failed to render company list");
    }
  }

  // Returns data as JSON (API response) instead of HTML
  static async getCompanyListJSON(req, res) {
    try {
      //Gets all companies again
      const companies = await CompanyModel.getAll();
      //Sends companies back in JSON format
      res.status(200).json(companies);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch companies" });
    }
  }

  // Gets a single company by name
  static async getCompanyByNameJSON(req, res) {
    try {
     //Searches database for that company
      const company = await CompanyModel.getByName(companyName);
      //If nothing is found send 404 error
      if (!company) return res.status(404).json({ error: "Company not found" });
      //If company is found, return that company as JSON
      res.status(200).json(company);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch company" });
    }
  }
}