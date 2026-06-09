// src/controllers/PricingCatalogueController.mjs
import { PricingCatalogueModel } from "../models/PricingCatalogueModel.mjs"; 

/**
 * The controller now has access to the PricingCatalogueModel class
 * and can call its methods.
 *
 * Fetches full pricing catalogue from the model and returns it as JSON
 * to the frontend with error handling for failed requests.
 */

export class PricingCatalogueController { //defines controller class and groups related API functions together

    /**
   * GET /api/pricing → full catalogue
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */
  static async getPricingCatalogue(req, res) {
    try {
      const pricing = await PricingCatalogueModel.getPricing();
      res.status(200).json(pricing);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to fetch pricing catalogue" });
    }
  }

    /**
   * GET /api/pricing/extras/:extraName → price for a single extra
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   */

  static async getExtraPrice(req, res) { 
    

    try { 

      /**
       * Extracts the URL parameter 'extraName' and uses it to
       * look up the matching price in the pricing catalogue model.
       */

      const extraName = req.params.extraName; 

      /**
       * Pricing model is called, matching extra is found and
       * price is returned.
       */
      const price = await PricingCatalogueModel.getExtraPrice(extraName);

       /**
       * Sends response to frontend - sends data to frontend.
       */

      res.status(200).json({ extra: extraName, price }); 
      
    } catch (err) { 

      /**
       * Catches errors - runs if anything breaks above.
       */
      console.error(err); 

        /**
       * Sends failure message to frontend, 500 server error.
       */
      res.status(500).json({ error: "Failed to fetch extra price" }); //Sends failure message to frontend, 500 server error
    }
  }
}