// src/controllers/PricingCatalogueController.mjs
import { PricingCatalogueModel } from "../models/PricingCatalogueModel.mjs";

export class PricingCatalogueController {
  // GET /api/pricing → full catalogue
  static async getPricingCatalogue(req, res) {
    try {
      const pricing = await PricingCatalogueModel.getPricing();
      res.status(200).json(pricing);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch pricing catalogue" });
    }
  }

  // GET /api/pricing/extras/:extraName → price for a single extra
  static async getExtraPrice(req, res) { 

    try { //helps run the code safely, if something fails go to catch

      const extraName = req.params.extraName; // Extracts the URL parameter 'extraName' and uses it to look up the matching price in the pricing catalogue model


      const price = await PricingCatalogueModel.getExtraPrice(extraName); //Pricing model is called, matching extra is found and price is returned



      res.status(200).json({ extra: extraName, price }); //Sends response to frontend - sends data to frontend
      
    } catch (err) { //Catches errors - Runs if anything breaks above

      console.error(err); //Prints error in terminal for debugging

      res.status(500).json({ error: "Failed to fetch extra price" }); //Sends failure message to frontend, 500 server error
    }
  }
}