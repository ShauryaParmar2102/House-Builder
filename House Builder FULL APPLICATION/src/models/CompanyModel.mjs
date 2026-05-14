// src/models/CompanyModel.mjs
export class CompanyModel {
  static async getAll() {
    // Simulate API fetch with static data for now
    return [
      { name: "DreamBuild Homes", basePrice: 170000, rating: 4.5 },
      { name: "Value Builders", basePrice: 150000, rating: 4.0 },
      { name: "Premium Living Co.", basePrice: 200000, rating: 4.8 }
    ];
  }

  static async getByName(name) {
    const companies = await this.getAll();
    return companies.find(c => c.name === name);
  }
}