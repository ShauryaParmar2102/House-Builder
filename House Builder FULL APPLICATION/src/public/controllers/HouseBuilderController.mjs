// HouseBuilderController handles creating and editing house builds
// - collects form data
// - validates input
// - saves to localStorage
// - supports edit mode using URL id

export class HouseBuilderController {

  // init() runs when the page loads, sets up the page, connects event listeners, and determines if the user is editing or creating a house

  // static means the method belongs to the class itself, so it can be called without creating an instance of the class

static init() {
const params = new URLSearchParams(window.location.search); // Gets everything after ? in the URL
HouseBuilderController.editId = params.get("id"); //ID is stored so it can be used inside of other methods in the same class, not just init()

  //params.get("id") Looks in the URL and finds the ID value

const editId = HouseBuilderController.editId; // Local shortcut for easier access to editId within this function

    //Edit mode: loads existing house for editing by Detecting editId in URL, Finds the saved house and Pre-fills the form inputs
    if (editId) { 
  let houses = JSON.parse(localStorage.getItem("houses")) || []; //Gets saved houses from browser storage

  const house = houses.find(h => h.id === editId); // Finds the house in LocalStorage that matches the editId

  //These lines fill the form fields with data that currently exist so that the user can edit a build
  if (house) {
    document.getElementById("name").value = house.title;
    document.getElementById("storeyCount").value = house.storeyCount;
    document.getElementById("rooms").value = house.rooms;
    document.getElementById("bathrooms").value = house.bathrooms;
    document.getElementById("garages").value = house.garages;
    document.getElementById("floorAreaSqm").value = house.floorAreaSqm;
    document.getElementById("facade").value = house.facade;
    document.getElementById("companyName").value = house.companyName;

       //house.extras is the list of extras the user previously selected.
        //cb.value is the value of the current checkbox getting checked in the loop.
        //includes() checks if the checkbox value exists in the saved extras array.

    // Re-checks previously selected extras when editing a Build
    if (house.extras) { // Checks if extras exist
      document.querySelectorAll("input[name='extras']") //Gets all checkbox inputs called “extras”
      .forEach(cb => { //Loops through each checkbox
        cb.checked = house.extras.includes(cb.value); //Marks checkbox as checked if it was previously selected
      });
    }
  }
}

    // Gets references to DOM elements so they can be used for events and interactions
    const form = document.getElementById("houseForm"); 
    const addToListBtn = document.getElementById("addToListBtn"); 
    const saveDraftBtn = document.getElementById("saveDraftBtn"); 

    // Listens for the form submit event (triggered by submit button or Enter key)
    // Prevents default form behaviour and handles validation and data processing in JavaScript.
    form.addEventListener("submit", async (e) => {  //Listens to form’s submit event.
      e.preventDefault(); // Stops page refresh

      const houseData = this.getFormData(); //Gets form data: Collects all user input into an object

      if (!this.validateHouse(houseData)) return; // Validation 

      
      try { //Starts error handling. If something fails like server down, bad request etc, the catch block will handle it
        const res = await fetch("http://localhost:3000/api/showcase", { //Sends house data to server in order to be saved and processed
          method: "POST", //Sends NEW data to the server
          headers: {
            "Content-Type": "application/json" //Sends Data in JSON format so the backend knows how to read it.
          },
          body: JSON.stringify(houseData) // Converts body into JSON format
        });

        const data = await res.json(); // Gets result from backend such as total cost etc.
        const preview = document.getElementById("preview"); //Where results are shown.

        //If backend fails, stop and log error
        if (!res.ok) {
      console.error(data);
        return;
    }
      } catch (err) {
        console.error(err);
      }
    });

    //When the button is clicked it runs the function inside { }
    addToListBtn.addEventListener("click", () => { // listens for a button click

  const houseData = this.getFormData(); //Collects all input values from the form and turns input value into form.

   //This function runs Validation on the houseData, and if it fails the function stops so that invalid data isn't saved
  if(!this.validateHouse(houseData)) return; 


  let houses = JSON.parse(localStorage.getItem("houses")) || []; //It tries to load existing saved houses from the browser.

    // EDIT MODE
    if (HouseBuilderController.editId) { //Checks if an id exists in the URL
    const index = houses.findIndex(h => String(h.id) === String(HouseBuilderController.editId)); //Searches the houses array and replaces it with the new updated data


    // EDIT MODE: update existing house build instead of creating a new one 

    if (index !== -1) { //Checks if the house was found: -1 means “not found” and anything else means valid index
      houseData.id = editId; //keeps the same ID so that a new house is not built because when a house is loaded, it already has an ID
      houses[index] = houseData; //This replaces the old house in the array
    }
        //  if (index !== -1) means only run this code if the item was found in the array.
  } 

  // CREATE HOUSE
  else { // User is creating a new house
    houseData.id = Date.now().toString(); // Creates a unique ID using current time
    houses.push(houseData); // Adds the new house into the array

      // If houses.push(housedata) is used in edit mode, it will create a duplicate instead of updating the existing house
  }

  localStorage.setItem("houses", JSON.stringify(houses)); // Saves updated array into browser storage
  window.location.href = "/views/HouseList.html"; //Sends user back to house list page so they can see updated/created house
      });
  }

  //  VALIDATION GOES HERE (OUTSIDE init)
  static validateHouse(houseData) {

      //Ensures houseName is not empty or just spaces
    if (!houseData.title || houseData.title.trim() === "") {
      alert("House name cannot be empty");
      return false;
    }
      //Makes sure that at least 1 room is entered
    if (houseData.rooms < 1) {
      alert("Rooms must be at least 1");
      return false;
    }
        //Prevents negative bathroom values
    if (houseData.bathrooms < 0) {
      alert("Bathrooms cannot be negative");
      return false;
    }
        //Ensure that at least one story is selected - anything less is invalid
    if (houseData.storeyCount < 1) { 
      alert("Storey Count must be at least 1");
      return false;
    }
        // Prevent negative garage values
    if (houseData.garages < 0) { 
      alert("Garages cannot be negative");
      return false;
    }
        //Make sure that floor area is valid, has to be greater than 0
    if (houseData.floorAreaSqm <= 0) { 
      alert("Floor area must be greater than 0"); 
      return false;
    }
    return true;
  }

  // If you remove = from <=, 0 would be allowed

  //< blocks values below minimum
  // <= blocks values below AND equal to the minimum

  // GETS FORM DATA
  static getFormData() { //Creates a function called getFormData and used to collect data from the form
    
    const extras = Array.from( //This converts the result into a real JavaScript array.
      document.querySelectorAll("input[name='extras']:checked") //Finds all checkbox inputs with name="extras" that are currently checked. 
    ).map(e => e.value); 

    //document.querySelectorAll("input[name='extras']:checked") finds all checkbox inputs with name="extras" that are currently checked.

    return {
      title: document.getElementById("name").value, //Gets house name from input box
      storeyCount: Number(document.getElementById("storeyCount").value), //Gets number of floors
      rooms: Number(document.getElementById("rooms").value), //Gets number of rooms
      bathrooms: Number(document.getElementById("bathrooms").value), //Gets number of bathrooms
      garages: Number(document.getElementById("garages").value), //Gets number of garages
      floorAreaSqm: Number(document.getElementById("floorAreaSqm").value), //Gets floorAreaSqm
      facade: document.getElementById("facade").value, //Gets Facade
      companyName: document.getElementById("companyName").value, //Gets companyName
      extras: extras, //Gets Extras
    };
  }

 //Backend Result
  static renderPreview(data) {
    return `
      <h2>Build Saved</h2>
      <p><b>House Name:</b> ${data.title}</p>
      <p><b>Storey Count:</b> ${data.storeyCount}</p>
      <p><b>Rooms:</b> ${data.rooms}</p>
      <p><b>Bathrooms:</b> ${data.bathrooms}</p>
      <p><b>Garages:</b> ${data.garages}</p>
      <p><b>Floor Area:</b> ${data.floorAreaSqm} sqm</p>
      <p><b>Facade:</b> ${data.facade || "Modern"}</p>
      <p><b>Company:</b> ${data.companyName}</p>
      <p><b>Extras:</b> ${data.extras.join(", ")}</p>
      <p><b>Total Cost:</b> $${data.totalCost}</p>
    `;
  }
}

//The form is linked to JavaScript using the houseForm ID. 
// The submit button works automatically because type="submit" triggers the form’s submit event, which JavaScript handles.

//type="submit" connects the button to the form’s submit event system

//form.addEventListener("submit") → wait for form submission
//e.preventDefault() → stop page reload
//getFormData() → collect user input
//validateHouse() → check if input is valid
//return → stop if invalid