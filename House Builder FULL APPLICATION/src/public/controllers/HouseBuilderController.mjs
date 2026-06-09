/**
 * Controls the House Builder page (Client-side controller)
 * Responsibilities:
 * - Loads companies and pricing extras from backend
 * - Handles edit mode using URL parameters
 * - Validates form input
 * - Sends POST / PUT requests to backend (Showcase API)
 * - Saves drafts and builds to localStorage
 */

export class HouseBuilderController { // Defines controller class

   /**
   * Initialises the House Builder page.
   * - Reads URL parameters for edit mode
   * - Loads existing house data if editing
   * - Fetches companies and extras from backend
   * - Sets up form event listeners
   *
   * @returns {Promise<void>}
   */
  static async init() { // INIT runs when the page loads

    // Edit Mode Setup: Reads URL parameters like /page.html?id=123
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");

    let editHouse = null;

    if (editId) { // LOADS EXISTING HOUSE from browser memory
      let houses = JSON.parse(localStorage.getItem("houses")) || [];
      editHouse = houses.find(h => String(h.id) === String(editId));

      // Pre-Fills the form fields
      // The || 1, || 0 parts are safe fallback values so the form never breaks visually or logically
      if (editHouse) {
        document.getElementById("name").value = editHouse.title || "";
        document.getElementById("storeyCount").value = editHouse.storeyCount || 1;
        document.getElementById("rooms").value = editHouse.rooms || 1;
        document.getElementById("bathrooms").value = editHouse.bathrooms || 0;
        document.getElementById("garages").value = editHouse.garages || 0;
        document.getElementById("floorAreaSqm").value = editHouse.floorAreaSqm || 0;
        document.getElementById("facade").value = editHouse.facade || "";
      }
    }


    // Gets DOM Elements
    const form = document.getElementById("houseForm");
    const saveDraftBtn = document.getElementById("addToListBtn");
    const companySelect = document.getElementById("companyName");
    const extrasFieldset = document.getElementById("extrasFieldset");

       /**
     * Loads companies from backend API and populates dropdown.
     *
     * @returns {Promise<void>}
     */
    
    const loadCompanies = async () => { //Creates an async function so it can use await for fetching data from the server.
      try {
        const res = await fetch("http://localhost:3000/api/companies"); // Sends GET request to backend to fetch company data from API, which is used for populating the dropdown
      
        if (!res.ok) throw new Error("Failed to fetch companies"); //If the server responds with an error (like 404 or 500), it stops and throws an error.
        
        const companies = await res.json(); //Turns the response into a JavaScript array/object
        companySelect.innerHTML = "";  //Removes old options so duplicates don't appear.

        //Creates dropdown options dynamically
        companies.forEach(company => { //Goes through each company one by one.
          const option = document.createElement("option"); //Creates a new <option> HTML element.
          option.value = company.name; //Sets option Value
          option.textContent = company.name; //Sets company name
          companySelect.appendChild(option); //Adds option value to dropdown
        });

        if (editHouse) { // If editing an existing house, pre-select its company in the dropdown
          companySelect.value = editHouse.companyName; // Sets dropdown to saved company
        }
      } catch (error) {
        console.error("Error loading companies:", error); //Prints an error message in the browser console
      }
    };

      /**
     * Loads pricing extras from backend API and builds checkbox list.
     *
     * @returns {Promise<void>}
     */

    const loadExtras = async () => { //creates an async function that talks to the backend and builds checkboxes in the UI
      try {
        const res = await fetch("http://localhost:3000/api/pricing"); //Sends a GET request to the backend API endpoint /api/pricing to fetch the pricing catalogue data in order to dynamically generate the extras UI (checkboxes).
        if (!res.ok) throw new Error("Failed to fetch pricing extras");
        
        const pricing = await res.json(); //Converts response to JSON
        extrasFieldset.innerHTML = ""; //Clears old extras

        pricing.extras.forEach(extra => { //Creates checkboxes dynamically
          const label = document.createElement("label"); //Puts each checkbox into your form UI.
          //builds the inside of a label element using a template string: it creates a checkbox and A text label next to it
          label.innerHTML = ` 
            <input type="checkbox" name="extras" value="${extra.name}"> 
            ${extra.name} ($${extra.price.toLocaleString()})
          `;
          extrasFieldset.appendChild(label);
        });

        // ${extra.name} inserts the name of the extra from the backend.
        //${extra.price.toLocaleString()} formats the number nicely so it looks user friendly

        if (editHouse?.extras) { //If user is editing an existing house it automatically ticks the checkboxes already selected
          extrasFieldset.querySelectorAll("input[name='extras']").forEach(cb => {
            cb.checked = editHouse.extras.includes(cb.value);
          });
        }
      } catch (error) {
        console.error("Error loading pricing extras:", error);
      }
    };

    await loadCompanies(); //fetches companies from the backend, fills the dropdown <select> and sets the selected company if editing
    await loadExtras(); //fetches extras from backend pricing API, builds checkbox list dynamically and pre-checks saved extras if editing

        /**
     * Handles form submission (Create or Update showcase post)
     * - Sends POST or PUT request to backend
     * - Saves response to localStorage
     * - Redirects to showcase page
     */

    form.addEventListener("submit", async (e) => { 
      e.preventDefault(); // Stop native page reload/refresh

      const houseData = HouseBuilderController.getFormData(); 

      if (!HouseBuilderController.validateHouse(houseData)) return; 

      // Determine if we are updating an existing showcase build
      let isServerUpdate = editId && editHouse && editHouse.status === "showcase"; //Decides whether user is Updating an existing showcase build (PUT) or Creating a new showcase build (POST).
      //isServerUpdate will be true only if three conditions are true: editId exists, editHouse exists, The house was found in localStorage, and if it has already been posted to the showcase.
      let url = isServerUpdate 
        ? `http://localhost:3000/api/showcase/${editId}` //Points to a specific build that is used with PUT meaning update the build with the ID.
        : "http://localhost:3000/api/showcase"; // If there is no existing edit ID, the base showcase endpoint is used to create a new post using the POST request.

        //? means if true
        // : means else

      try { //Attempt to run this code
        let res = await fetch(url, { //Sends a HTTP request to your backend.
          method: isServerUpdate ? "PUT" : "POST", // Chooses PUT for updating an existing showcase post, otherwise POST to create a new showcase post depending on whether the build already exists on the server.
          headers: { "Content-Type": "application/json" }, //Without this, backend might not understand the request properly.
          body: JSON.stringify(houseData) //This is your actual data being sent.
        });

        //res.status checks TWO conditions like server says “not found” and the house ID does not exist
        if (res.status === 404 && isServerUpdate) { //Checks for error condition
          console.warn(`ID ${editId} not found on server. Switching to POST to create a new showcase build.`); //Warning message
          url = "http://localhost:3000/api/showcase"; //Ensures the user is now hitting the create endpoint again.
          res = await fetch(url, { //Sends a NEW HTTP request to the server by overwriting the old res and waiting for server response
            method: "POST", //create new record, not update
            headers: { "Content-Type": "application/json" }, //Without this, backend might not understand the request properly.
            body: JSON.stringify(houseData)
          });
        }
        
        const data = await res.json(); //Converts the JSON response 
        // from the server into a JavaScript object so the frontend can access returned values such as the updated ID and calculated total cost.

        //res is the response from your server after fetch.
        //.json tells Javascript to take the response body and convert it from JSON text into a JavaScript object.
        //await is needed because reading/parsing data takes time and JavaScript waits for the conversion to finish.
        //const data stores the result into a variable called data.

        if (!res.ok) {
          console.error("Server error:", data);
          alert(data.error || data.message || "Failed to save data on server.");
          return;
        }

        // Apply properties from server response payload
        houseData.totalCost = data.totalCost; //Assigns the calculated total cost returned from the backend response into the houseData object so it can be stored and used in the frontend
        houseData.status = "showcase"; //Marks the house as now published or saved to the public showcase
        houseData.id = data.id || editId; //Assigns final ID of the house: It means use data.id (ID returned from server) if it exists or Otherwise fall back to editId (existing ID when editing)

        //HouseList and Showcase page stay in sync because they both rely on the same shared source of truth which is localStorage.getItem("houses")

        // Get local browser tracking array
        let houses = JSON.parse(localStorage.getItem("houses")) || []; // Retrieves saved houses from LocalStorage, converts them from JSON into a JavaScript array and falls back to an empty array if no data exists yet.
        
        // Anti-duplicate filter: Strip away any matching references
        houses = houses.filter(h => String(h.id) !== String(editId) && String(h.id) !== String(houseData.id));
        
        // Push the finalized server item back into local memory
        houses.push(houseData);
        localStorage.setItem("houses", JSON.stringify(houses));

        alert("House saved to showcase successfully!");
        window.location.href = "/views/Showcase.html";

      } catch (error) {
        console.error("Network connectivity issue:", error);
        alert("Could not connect to the remote server. Please verify network state.");
      }
    });

    saveDraftBtn.addEventListener("click", (e) => { 
      e.preventDefault(); // Stop the Draft button from triggering the form submission!

      const houseData = HouseBuilderController.getFormData(); 

      if (!HouseBuilderController.validateHouse(houseData)) return; 

      let houses = JSON.parse(localStorage.getItem("houses")) || []; 

      // Keep the current ID if editing a draft, or generate a fresh draft identifier
      houseData.id = editId || `draft_${Date.now()}`; 
      houseData.status = "draft"; 

      // Clean up previous local storage duplicate references
      houses = houses.filter(h => String(h.id) !== String(editId) && String(h.id) !== String(houseData.id));
      houses.push(houseData); 
      
      localStorage.setItem("houses", JSON.stringify(houses));
 
      alert("House saved Successfully!");
      window.location.href = "/views/HouseList.html";
    });
  }

  /**
 * Validates house form input before saving
 * @param {Object} houseData - The house data from the form
 * @returns {boolean} true if valid, false if invalid
 */

  static validateHouse(houseData) {
    if (!houseData.title || houseData.title.trim() === "") {
      alert("House name cannot be empty");
      return false;
    }
    if (houseData.rooms < 1) {
      alert("Rooms must be at least 1");
      return false;
    }
    if (houseData.bathrooms < 0) {
      alert("Bathrooms cannot be negative");
      return false;
    }
    if (houseData.storeyCount < 1) {
      alert("Storey count must be at least 1");
      return false;
    }
    if (houseData.garages < 0) {
      alert("Garages cannot be negative");
      return false;
    }
    if (houseData.floorAreaSqm <= 0) {
      alert("Floor area must be greater than 0");
      return false;
    }
    return true;
  }

  /**
   * Extracts form data from DOM
   *
   * @returns {Object}
   */

  static getFormData() { 
    const extras = Array.from(
      document.querySelectorAll("input[name='extras']:checked")
    ).map(e => e.value);

    return {
      title: document.getElementById("name").value,
      storeyCount: Number(document.getElementById("storeyCount").value),
      rooms: Number(document.getElementById("rooms").value),
      bathrooms: Number(document.getElementById("bathrooms").value),
      garages: Number(document.getElementById("garages").value),
      floorAreaSqm: Number(document.getElementById("floorAreaSqm").value),
      facade: document.getElementById("facade").value,
      companyName: document.getElementById("companyName").value,
      extras
    };
  }
}
