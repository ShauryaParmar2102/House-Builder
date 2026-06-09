// src/controllers/CompanyController.mjs
import { CompanyModel } from "../models/CompanyModel.mjs";

/**
 * Controller responsible for handling company-related requests.
 * Retrieves company data from the CompanyModel and returns it
 * as either HTML views or JSON API responses.
 */

export class CompanyController {

     /**
   * Renders the company list HTML page.
   * Retrieves all companies from the model and passes them
   * to the EJS view for display.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */

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

    /**
   * Returns all companies as a JSON response.
   * Used by frontend components such as dropdown menus.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */
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

    /**
   * Retrieves a single company by name and returns it as JSON.
   * Reads the company name from the URL parameter and searches
   * the CompanyModel for a matching company.
   *
   * @param {Object} req - Express request object containing the company name parameter.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */

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