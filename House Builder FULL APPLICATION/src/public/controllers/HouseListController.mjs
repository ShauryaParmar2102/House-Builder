//The HouseListController loads all houses, displays them as cards, and allows the user to create, edit, and delete houses from the list.

//Brings in model, handles data like getAll, delete, etc and controller uses it to fetch and delete houses
import { HouseListModel } from "../models/HouseListModel.mjs"; 

//Controls the House List page behaviour
export class HouseListController {
  static container; //where houses are displayed
  static newBtn; //button to create a new build

  //container is where house cards appear on the page

  //newBtn is the button for creating a new house

  //Static matters because you don’t need to create an object and HouseListController.init() is used directly

  // init() runs when the page loads, sets up the page and checks if the user is editing or creating a house build

  // static means the function belongs to the class in order for it to be called without creating an object

static init() {   //Runs when the page loads by reading URL parameters, connecting HTML elements, setting up event listeners and loading the houseList

    const params = new URLSearchParams(window.location.search); //Reads the URL query string in order to extract values like ID

    const editId = params.get("id"); //Gets the value of id from URL if it exists.

  console.log("HouseList init running"); //Checks if code is running

  //Links JavaScript to HTML elements
  this.container = document.getElementById("houseContainer");
  this.newBtn = document.getElementById("newBuildButton");

  console.log("container:", this.container);

  //New house button
  this.newBtn.addEventListener("click", () => { //If there is no build, create a house
    window.location.href = "/views/HouseBuilder.html"; //When clicked user is taken to HouseBuilder Page
  });

  this.render(); //Calls static async render() to display the houses on screen
}
    //Displays all houses on the page
  static async render() {
    const houses = await HouseListModel.getAll(); //Gets all saved house builds again

    this.container.innerHTML = ""; //Removes old content before reloading

    //Loops through every house in the list. Each h is a house object
    houses.forEach(h => {
  const card = document.createElement("div"); //new <div> element created for each card
  card.className = "house-card";

  card.innerHTML = `
    <h3>${h.title}</h3>
    <p>Company: ${h.companyName}</p>
    <p>Storeys: ${h.storeyCount}</p>
    <p>Rooms: ${h.rooms}</p>
    <p>Bathrooms: ${h.bathrooms}</p>
    <p>Garages: ${h.garages}</p>
    <p>Area: ${h.floorAreaSqm} sqm</p>
    <p>Extras: ${(h.extras || []).join(", ")}</p>
  `;

  const deleteButton = document.createElement("button");
  deleteButton.textContent = "Delete";

  //Delete this house from storage/backend and refresh the list User Interface
  deleteButton.addEventListener("click", async () => { //Listens for a click on the delete button and When clicked → runs the function inside { }

    await HouseListModel.delete(h.id);  //Calls the delete function in the model, Passes the house ID (h.id) and Removes that house from LocalStorage

    this.render(); //Re-runs the render function, Refreshes the page display and Shows updated list WITHOUT the deleted house

    //async () => { ... } means This function can use await and allows waiting for backend or model operations
  });

  card.appendChild(deleteButton); //Adds the delete button into the house card and makes it show on the page

  //  EDIT BUTTON - Takes user to HouseBuilder page, Sends house ID in URL and user can edit house
  const editButton = document.createElement("button"); // Creates a button

  editButton.textContent = "Edit"; //Sets text to “Edit”

  editButton.addEventListener("click", () => { //sends user to HouseBuilder page when clicked
    window.location.href = `/views/HouseBuilder.html?id=${h.id}`; //Passes the house ID in the URL
  });

  card.appendChild(editButton); // physically puts the buttons inside the card.

  this.container.appendChild(card); // Adds full house card into the page so it becomes visible.
    });
  }
}