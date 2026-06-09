/**
 * HouseListModel handles all house data stored in browser localStorage.
 *
 * Responsibilities:
 * - Stores and retrieves house builds
 * - Adds new house entries
 * - Deletes existing house entries
 * - Finds houses by ID
 * - Persists data using localStorage
 */

export class HouseListModel {

  
   /**
   * Key used for localStorage storage
   * @type {string}
   */

  static STORAGE_KEY = "houses";

    /**
   * Retrieves all saved houses from localStorage
   *
   * @returns {Array<Object>} Array of house objects
   */

  static getAll() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
  }
     /**
   * Saves all houses to localStorage
   *
   * @param {Array<Object>} houses - Array of house objects to store
   */

  static saveAll(houses) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(houses));
  }
      /**
   * Adds a new house to storage
   *
   * @param {Object} house - House object to add
   * @returns {void}
   */

  static add(house) {
    house.id = Date.now().toString(); // Creates a unique ID using current time
    const houses = this.getAll(); //Gets existing houses and adds new one
    houses.push(house);
    this.saveAll(houses); // Saves updated list back to storage
  }

    /**
   * Retrieves a single house by ID
   *
   * @param {string} id - House ID
   * @returns {Object|undefined} Matching house object or undefined if not found
   */

  static getById(id) {
    return this.getAll().find(h => h.id === id); // Gets all houses and finds the one with matching ID
  }

   /**
   * Deletes a house from storage by ID
   *
   * @param {string} id - House ID to remove
   * @returns {void}
   */

  //Gets all houses, Removes the one with matching ID and saves updated list
  static delete(id) {
    const houses = this.getAll().filter(h => h.id !== id);
    this.saveAll(houses);
  }
}

/*
getAll() -> get all houses
saveAll() -> overwrite storage
add() -> add a new house
getById() -> find one house
delete() -> remove a house
*/