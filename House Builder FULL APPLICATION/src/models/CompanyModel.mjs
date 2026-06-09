/**
 * Represents a building company.
 * Stores company details such as name, base price,
 * rating and available extras.
 */

export class CompanyModel {

  /**
   * Creates a new CompanyModel instance.
   *
   * @param {string} name - Company name.
   * @param {number} basePrice - Base price of homes built by the company.
   * @param {number} rating - Customer rating of the company.
   * @param {Array} extras - List of available extras.
   */

  constructor(name, basePrice, rating, extras = []) {
    this.name = name;
    this.basePrice = basePrice;
    this.rating = rating;
    this.extras = extras;
  }

   /**
   * Retrieves all companies and returns them as
   * CompanyModel instances.
   *
   * @returns {Promise<CompanyModel[]>} Array of companies.
   */

  static async getAll() {
    const data = [
      { name: "DreamBuild Homes", basePrice: 170000, rating: 4.5, extras: [] },
      { name: "Value Builders", basePrice: 150000, rating: 4.0, extras: [] },
      { name: "Premium Living Co.", basePrice: 200000, rating: 4.8, extras: [] }
    ];

    return data.map(c =>
      new CompanyModel(c.name, c.basePrice, c.rating, c.extras)
    );
  }

    /**
   * Finds a company by its name.
   *
   * @param {string} name - Name of the company to search for.
   * @returns {Promise<CompanyModel|null>} Matching company or null if not found.
   */

  static async getByName(name) {
    const companies = await this.getAll();
    return companies.find(c => c.name === name) || null;
  }
}