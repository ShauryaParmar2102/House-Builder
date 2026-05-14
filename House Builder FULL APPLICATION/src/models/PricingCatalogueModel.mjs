// src/models/PricingCatalogueModel.mjs
export class PricingCatalogueModel {
  //Returns all pricing rules
  static async getPricing() {
    // Simulate API fetch with static data for now
    return {
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
  }

  //Gets price for a specific extra
  static async getExtraPrice(extraName) {
    const catalog = await this.getPricing();
    const extra = catalog.extras.find(e => e.name === extraName);
    return extra ? extra.price : 0;
  }
}