/**
 * PricingCatalogueModel represents the full pricing structure used
 * in the house builder web application.
 *
 * It stores base construction costs (rooms, bathrooms, garages, sqm)
 * as well as optional extras with individual pricing.
 *
 * This model is used by the backend to provide pricing data to the frontend
 * and to calculate costs for house builds.
 */

export class PricingCatalogueModel {

   /**
   * Creates a PricingCatalogueModel instance.
   *
   * @param {Object} data - Raw pricing data object.
   * @param {number} data.perRoom - Cost per room.
   * @param {number} data.perBathroom - Cost per bathroom.
   * @param {number} data.perGarage - Cost per garage.
   * @param {number} data.perSqm - Cost per square metre.
   * @param {Array} data.extras - List of available extras with name and price.
   */

  constructor(data) {
    this.perRoom = data.perRoom;
    this.perBathroom = data.perBathroom;
    this.perGarage = data.perGarage;
    this.perSqm = data.perSqm;
    this.extras = data.extras;
  }

    /**
   * Retrieves the full pricing catalogue.
   *
   * @returns {Promise<PricingCatalogueModel>} Pricing catalogue instance.
   */

  static async getPricing() {
    //Raw Data
    const data = {
      perRoom: 18000,
      perBathroom: 12000,
      perGarage: 15000,
      perSqm: 1200,
      extras: [
        { name: "Built-in Wardrobe", price: 8000 },
        { name: "Double Glazing Windows", price: 3500 },
        { name: "Solar Panel Installation (Standard)", price: 15000 }
      ]
    };

    return new PricingCatalogueModel(data); // Converts raw backend pricing data into a PricingCatalogueModel instance
  }

    /**
   * Retrieves the price of a single extra by name.
   *
   * @param {string} extraName - Name of the extra to look up.
   * @returns {Promise<number>} Price of the extra, or 0 if not found.
   */

  static async getExtraPrice(extraName) {
    const catalog = await this.getPricing();
    const extra = catalog.extras.find(e => e.name === extraName); // Map raw extra objects into ExtraItem instances
    return extra ? extra.price : 0;
  }
}