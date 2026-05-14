// src/models/HouseListModel.mjs

//All house data is stored under houses in browser storage
export class HouseListModel {
  static STORAGE_KEY = "houses";

  //Get all saved houses and if none exist, empty list is returned 
  static getAll() {
    return JSON.parse(localStorage.getItem(this.STORAGE_KEY)) || [];
  }
    //Takes an array of houses, Converts it into JSON string and saves it in local storage.
  static saveAll(houses) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(houses));
  }
    //New house is added to storage
  static add(house) {
    house.id = Date.now().toString(); // Creates a unique ID using current time
    const houses = this.getAll(); //Gets existing houses and adds new one
    houses.push(house);
    this.saveAll(houses); // Saves updated list back to storage
  }

  static getById(id) {
    return this.getAll().find(h => h.id === id); // Gets all houses and finds the one with matching ID
  }

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