// ShowcaseController handles backend showcase posts
// - creates posts
// - validates input
// - calculates total cost
// - supports update and delete operations

// src/controllers/ShowcaseController.mjs
import { PricingCatalogueModel } from "../models/PricingCatalogueModel.mjs";
import { CompanyModel } from "../models/CompanyModel.mjs";
import { ShowcasePostModel } from "../models/ShowcasePostModel.mjs";

//Main controller for showcase builds - it handles getting, creating, updating and deleting builds
export class ShowcaseController {

  // GET all showcase builds and display them 
  static async getShowcaseJSON(req, res) { //Used for creating a new house build using form data.
    const allBuilds = ShowcasePostModel.getAll();
    res.status(200).json(allBuilds);
  }

  // Creates a validated house build and saves it to Showcase storage
  static async publishBuild(req, res) { //Main function that creates a house build
    try {
      //Data is sent from frontend 
      const house = req.body; //receives user input from browser

      //Gets data needed for calculation
      const pricing = await PricingCatalogueModel.getPricing(); // Loads pricing rules for cost calculation


      const companies = await CompanyModel.getAll(); //Gets list of all available companies so now system knows which companies are valid

      const company = companies.find(c => c.name === house.companyName); // Finds the selected company based on user input


      // Validation - Make sure user input is correct before saving anything
      const errors = []; //Checks if input is valid: Title exists, numbers are valid, company exists and extras are valid
      if (!house.title || house.title.trim() === "") errors.push("Invalid title");
      if (!company) errors.push("Invalid company");
      if (!Number.isInteger(house.rooms) || house.rooms <= 0) errors.push("Invalid rooms");
      if (!Number.isInteger(house.bathrooms) || house.bathrooms < 0) errors.push("Invalid bathrooms");
      if (!Number.isInteger(house.garages) || house.garages < 0) errors.push("Invalid garages");
      if (!Number.isFinite(house.floorAreaSqm) || house.floorAreaSqm <= 0) errors.push("Invalid floor area");
      if (!Number.isInteger(house.storeyCount) || house.storeyCount <= 0) errors.push("Invalid storey count");

      const invalidExtras = house.extras?.filter(e => !pricing.extras.some(pe => pe.name === e));
      if (invalidExtras?.length) errors.push(`Invalid extras: ${invalidExtras.join(", ")}`);

      if (errors.length > 0) {
        return res.status(400).json({ errors }); //If error exists, stop request if invalid
      }

      // Calculate total cost
      let totalCost = 0;
      totalCost += house.rooms * pricing.perRoom; //Adds room costs: Takes number of rooms, Multiplies by cost per room and Adds result to total

      totalCost += house.bathrooms * pricing.perBathroom; //Adds Bathroom cost: Calculates bathroom cost and Adds it to total

      totalCost += house.garages * pricing.perGarage; //Adds garage cost based on number of garages

      totalCost += house.floorAreaSqm * pricing.perSqm; //Adds floor area cost: Charges per square metre 

      house.extras?.forEach(extraName => { //Loops through extras if they exist, ? means only run if these extras exist

        const extraData = pricing.extras.find(e => e.name === extraName); //Find matching extra price: Searches pricing list and finds the matching extra

        if (extraData) totalCost += extraData.price; //If extra exists → add its price but if not, Ignore it safely
      });

      // Builds house 
      const build = {
        id: `sc_${Date.now()}`, // unique ID
        title: house.title, //Displays house title
        companyName: company.name, //displays company name
        rooms: house.rooms,
        bathrooms: house.bathrooms,
        garages: house.garages,
        floorAreaSqm: house.floorAreaSqm,
        storeyCount: house.storeyCount,
        extras: house.extras,
          facade: house.facade, 
        totalCost: totalCost
      };

      ShowcasePostModel.add(build);
      res.status(201).json(build);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to publish build" });
    }
  }

  // PUT - Updates an existing build
  static async updateBuild(req, res) { //Defines an API function for updating a house

    try { //Wraps code in safety net. If something breaks go to catch

      const id = req.params.id; //Gets the house ID from the URL

      const existingBuild = ShowcasePostModel.getById(id); //Searches storage for the house with specific ID

      if (!existingBuild) return res.status(404).json({ error: "Build not found" }); //If house doesn’t exist send back error and stop function immediately

      const house = req.body; // Gets updated form data sent by user

      const pricing = await PricingCatalogueModel.getPricing(); //Loads price rules again and required to recalculate costs

      const companies = await CompanyModel.getAll(); //Gets list of builders again

      const company = companies.find(c => c.name === house.companyName); //Checks if selected company exists and Matches by name

      // Validate input before saving to prevent invalid builds
      const errors = [];
      if (!house.title || house.title.trim() === "") errors.push("Invalid title");
      if (!company) errors.push("Invalid company");
      if (!Number.isInteger(house.rooms) || house.rooms <= 0) errors.push("Invalid rooms");
      if (!Number.isInteger(house.bathrooms) || house.bathrooms < 0) errors.push("Invalid bathrooms");
      if (!Number.isInteger(house.garages) || house.garages < 0) errors.push("Invalid garages");
      if (!Number.isFinite(house.floorAreaSqm) || house.floorAreaSqm <= 0) errors.push("Invalid floor area");
      if (!Number.isInteger(house.storeyCount) || house.storeyCount <= 0) errors.push("Invalid storey count");

      const invalidExtras = house.extras?.filter(e => !pricing.extras.some(pe => pe.name === e));
      if (invalidExtras?.length) errors.push(`Invalid extras: ${invalidExtras.join(", ")}`);

      if (errors.length > 0) return res.status(400).json({ errors });

      // Recalculate total cost
      // ? Only runs forEach if extras exists, prevents crash if value is undefined
      let totalCost = 0;
      totalCost += house.rooms * pricing.perRoom;
      totalCost += house.bathrooms * pricing.perBathroom;
      totalCost += house.garages * pricing.perGarage;
      totalCost += house.floorAreaSqm * pricing.perSqm;
      house.extras?.forEach(extraName => {
        const extraData = pricing.extras.find(e => e.name === extraName);
        if (extraData) totalCost += extraData.price;
      });

      // Update the existing build
      Object.assign(existingBuild, { //This is the house already saved in the system.
        title: house.title, // what the user just submitted
        companyName: company.name,
        rooms: house.rooms,
        bathrooms: house.bathrooms,
        garages: house.garages,
        floorAreaSqm: house.floorAreaSqm,
        storeyCount: house.storeyCount,
        extras: house.extras,
        totalCost: totalCost
      });

      //target = existingBuild
      //source = new updated values

      res.json(existingBuild);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to update build" });
    }
  }

  // DELETE - Remove a build 
  static async deleteBuild(req, res) {
    try {
      const id = req.params.id;
      const existingBuild = ShowcasePostModel.getById(id);
      if (!existingBuild) return res.status(404).json({ error: "Build not found" });

      ShowcasePostModel.delete(id);
      res.status(204).end();

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to delete build" });
    }
  }
}