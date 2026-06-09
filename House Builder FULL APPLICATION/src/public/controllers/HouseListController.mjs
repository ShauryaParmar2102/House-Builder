

import { HouseListModel } from "../models/HouseListModel.mjs"; 

/**
 * HouseListController handles the House List page.
 *
 * Responsibilities:
 * - Loads all house builds from the model
 * - Displays house cards in the UI
 * - Provides search and sorting functionality
 * - Handles delete and edit actions
 * - Fetches showcase data for total cost display
 */

export class HouseListController {
static container;
static newBtn;
static searchInput;
static sortFilter;

static searchQuery = "";
static sortOption = "";

  /**
 * Initialises the House List page
 * - Connects DOM and HTML elements to Javascript
 * - Sets up event listeners
 * - Loads initial house data
 */

static async init() {   

  const params = new URLSearchParams(window.location.search); 

    const editId = params.get("id"); 

  console.log("HouseList init running"); 

  //Links JavaScript to HTML elements
  this.container = document.getElementById("houseContainer");
  this.newBtn = document.getElementById("newBuildButton");
   this.searchInput = document.getElementById("houseSearch");
    this.sortFilter = document.getElementById("sortFilter");

this.searchInput.addEventListener("input", (e) => { //Listens for typing
  this.searchQuery = e.target.value.toLowerCase(); //Stores what the user typed
  this.render(); //Re-renders list
});

   // SORT CHANGE
    this.sortFilter.addEventListener("change", (e) => { //fires when dropdown changes
      this.sortOption =
       e.target.value; //gets selected value (example: "rooms-asc")
      this.render(); //redraws the house list using new sort
    });

    // Sort Options
    const houses = await HouseListModel.getAll(); //Gets ALL saved houses from storage
    const sample = houses[0]; // Takes the first house only

    if (sample) { //Prevents crash if no houses exist

      //dropdown is generated here
  const sortFields = [
  { key: "title", label: "Name" },
  { key: "companyName", label: "Company" },
  { key: "rooms", label: "Rooms" },
  { key: "bathrooms", label: "Bathrooms" },
  { key: "storeyCount", label: "Storeys" },
  { key: "garages", label: "Garages" },
  { key: "floorAreaSqm", label: "Floor Area" },
  { key: "totalCost", label: "Cost" }
];

const sortOptions = []; // Generate dropdown options automatically

sortFields.forEach(field => { //Loops through every item in the sortFields array.
  sortOptions.push(
    { label: `${field.label} ↑`, value: `${field.key}-asc` }, //Creates Ascending sorting option
    { label: `${field.label} ↓`, value: `${field.key}-desc` } //Creates Descending sorting option
  );
});

// Render into dropdown
sortOptions.forEach(opt => { // Loops through all generated sort options
  const option = document.createElement("option"); // Creates a new <option> element for the dropdown
  option.value = opt.value; // Sets the option value used by the sorting logic
  option.textContent = opt.label; //Sets the text displayed to user
  this.sortFilter.appendChild(option);  // Adds the option into the sort dropdown
      });
    }

  console.log("container:", this.container);

  //New house button
  this.newBtn.addEventListener("click", () => { //If there is no build, create a house
    window.location.href = "/views/HouseBuilder.html"; //When clicked user is taken to HouseBuilder Page
  });

  this.render(); //Calls static async render() to display the houses on screen
}
    //Displays all houses on the page

    /**
    * Renders the house list on the page
    * - Fetches house data from HouseListModel
    * - Applies search filtering
    * - Applies sorting logic
    * - Displays house cards in the UI
    */

  static async render() {
    let houses = await HouseListModel.getAll(); //Gets all saved house builds again from LocalStorage

    /**
   * Fetches cost data from the backend showcase API
   * Used to attach calculated total cost to each house
   */

    const res = await fetch("http://localhost:3000/api/showcase"); //This is where total cost gets fetched
      const showcaseData = await res.json(); 

       /**
   * Merges showcase cost data into local houses array
   * Uses title matching to find corresponding showcase build
   */

  houses = houses.map(house => { //Merges cost into houses
  const match = showcaseData.find(s => s.title === house.title); //Finds matching showcase house by looking inside showcase data and finds house with the same title

    //Attaches Cost
    return {
      ...house,
      totalCost: match ? match.totalCost : 0 
    };
  });


    if (this.searchQuery) {
  houses = houses.filter(h =>
    h.title.toLowerCase().includes(this.searchQuery) ||
    h.companyName.toLowerCase().includes(this.searchQuery) ||
    String(h.rooms).includes(this.searchQuery) ||
    String(h.bathrooms).includes(this.searchQuery)
  );
}


 if (this.sortOption) {
  const [field, direction] = this.sortOption.split("-"); //Spliting happens with this line

  houses.sort((a, b) => {   // Sorts the houses array by comparing two items at a time using the selected field and direction

    let aVal = a[field]; // value from house A
    let bVal = b[field]; // value from house B

          // Handle missing values safely
    if (aVal == null) return 1;  // If a is missing data, push it lower in sort order
    if (bVal == null) return -1;  // If b is missing data, push it lower in sort order

          // Check if values are numeric
    const isNumber =
      typeof aVal === "number" && //checks if a value is a number 
      typeof bVal === "number"; //checks if b vaue is a number

    // String sorting fallback
    if (isNumber) {
      return direction === "asc"
        ? aVal - bVal // Ascending: low to high
        : bVal - aVal; // Descending: high to low
    }

    // string sorting
    return direction === "asc"
      ? String(aVal).localeCompare(String(bVal))
      : String(bVal).localeCompare(String(aVal));
  });
}
    this.container.innerHTML = ""; //Removes old content before reloading

if (houses.length === 0) {
  this.container.innerHTML = `
    <p class="empty-message">
      No house builds found. Start by creating one!
    </p>
  `;
  return;
}


  houses.forEach(h => { //Loops through every house in the list. Each h is a house object
  const card = document.createElement("div"); //new <div> element created for each card
  card.className = "house-card"; //Fills the div with the house data including the title, rooms, bathrooms

  card.innerHTML = `
    <h3>${h.title}</h3>
    <p>Company: ${h.companyName}</p>
    <p>Storeys: ${h.storeyCount}</p>
    <p>Rooms: ${h.rooms}</p>
    <p>Bathrooms: ${h.bathrooms}</p>
    <p>Garages: ${h.garages}</p>
    <p>Floor Area: ${h.floorAreaSqm} sqm</p>
    <p>Extras: ${(h.extras || []).join(", ")}</p>
    <p><b>Total Cost:</b> $${h.totalCost ? h.totalCost.toLocaleString() : "0"}</p>
  `;

    
  const deleteButton = document.createElement("button"); //Creates a new button element in memory but not visible on page yet
  deleteButton.textContent = "Delete"; //Sets button text to delete

  deleteButton.addEventListener("click", async () => { //Listens for a click on the delete button and When clicked → runs the function inside { }

    //removes the house using its ID
    await HouseListModel.delete(h.id);  //Calls the delete function in the model, Passes the house ID (h.id) and Removes that house from LocalStorage

    this.render(); //Re-runs the render function, Refreshes the page display and Shows updated list WITHOUT the deleted house

  });

  card.appendChild(deleteButton); //Adds the delete button into the house card and makes it show on the page

    /**
     * Edit button redirects to House Builder with selected ID
     */

  const editButton = document.createElement("button"); // Creates button

  editButton.textContent = "Edit"; //Sets text to “Edit”

  editButton.addEventListener("click", () => { //sends user to HouseBuilder page when clicked
    window.location.href = `/views/HouseBuilder.html?id=${h.id}`; //Passes the house ID in the URL
  });

  card.appendChild(editButton); // physically puts the buttons inside the card.

  this.container.appendChild(card); //Without this, the card would be created but NOT shown
    });
  }
}