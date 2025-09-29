import { createProfile } from './profile.js';

// Let's create pokemon listings for each type 
// We receive as input all types of Pokemon including a list of its members 
// To understand the structure of the data, check the console log in the browser.
const createListings = () => {
  // Geoapify API integration for listing cafes and bubble tea places with allergen filters

  const API_KEY = "45ac13a7c2764f6880bc0a63095448e3";
  const BASE_URL = "https://api.geoapify.com/v2/places";
  const DEFAULT_LOCATION = "circle:-79.698788,43.469814,5000"; // 5km radius
  const DEFAULT_CATEGORIES = "catering.cafe";
  const ALLERGENS = [
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Vegetarian Only", value: "vegetarian.only" },
    { label: "Vegan", value: "vegan" },
    { label: "Vegan Only", value: "vegan.only" },
    { label: "Halal", value: "halal" },
    { label: "Halal Only", value: "halal.only" },
    { label: "Kosher", value: "kosher" },
    { label: "Kosher Only", value: "kosher.only" },
    { label: "Organic", value: "organic" },
    { label: "Organic Only", value: "organic.only" },
    { label: "Gluten Free", value: "gluten_free" },
    { label: "Sugar Free", value: "sugar_free" },
    { label: "Egg Free", value: "egg_free" },
    { label: "Soy Free", value: "soy_free" },
  ];

  // Render allergen filter checkboxes
  function renderAllergenFilters() {
    const filterDiv = document.getElementById("allergen-filters");
    if (!filterDiv) return;
    filterDiv.innerHTML = ALLERGENS.map(a => `
      <label><input type="checkbox" value="${a.value}" class="allergen-checkbox"> ${a.label}</label>
    `).join(" ");
  }

  // Fetch places from Geoapify
  async function fetchPlaces(selectedAllergens = []) {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      filter: DEFAULT_LOCATION,
      categories: DEFAULT_CATEGORIES,
      limit: 30,
    });
    if (selectedAllergens.length > 0) {
      params.append("conditions", selectedAllergens.join(","));
    }
    const url = `${BASE_URL}?${params.toString()}`;
    console.log("Geoapify API URL:", url);
    const res = await fetch(url);
    const data = await res.json();
    return data.features || [];
  }

  // Render places as a list
  function renderPlaces(places) {
    const listDiv = document.getElementById("places-list");
    if (!listDiv) return;
    if (places.length === 0) {
      listDiv.innerHTML = "<p>No results found.</p>";
      return;
    }
    listDiv.innerHTML = places.map(f => {
      const p = f.properties;
      return `
        <div class="place-item">
          <h3>${p.name || "Unnamed"}</h3>
          <p>${p.formatted || "No address"}</p>
          ${p.website ? `<a href="${p.website}" target="_blank">Website</a>` : ""}
          <div class="categories">${(p.categories || []).join(", ")}</div>
        </div>
      `;
    }).join("");
  }

  // Handle filter changes
  async function handleFilterChange() {
    const checked = Array.from(document.querySelectorAll('.allergen-checkbox:checked')).map(cb => cb.value);
    const places = await fetchPlaces(checked);
    renderPlaces(places);
  }

  // Initialize immediately
  async function init() {
    renderAllergenFilters();
    document.getElementById("allergen-filters").addEventListener("change", handleFilterChange);
    const places = await fetchPlaces();
    renderPlaces(places);
  }
  init();

//   // iterate over the list of pokemon types
//   // filter out the ones that have no pokemon (e.g. "unknown", "shadow")
//   pokemonTypes
//     .filter(pokemonType => pokemonType.pokemon.length > 0)
//     .forEach(pokemonType => {
//       // add a section to the page to hold pokemon of this type
//       const section = document.createElement('section')
//       section.classList.add(pokemonType.name)
//       // Iterate over the list of members for this type. 
//       // Members live inside a nested "pokemon" array 
//       pokemonType.pokemon
//         .forEach(item => {
//           // get the ID from the URL for this pokemon
//           // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
//           const id = item.pokemon.url.split('/').filter(e => Number(e)).pop()
//           // Skip any pokemon with an ID > 10000 
//           // NOTE: these IDs are alternate forms that often lack images
//           if (id > 10000) return
//           // get a sprite icon directly from GitHub based on the ID  
//           const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
//           // assign a unique ID to the popover accounting for pokemon having multiple types
//           const popoverId = `${pokemonType.name}-${id}`
//           // make a div / template for each listing. 
//           const div = document.createElement('div')
//           div.classList.add('listing')
//           // the template includes a button to open the popover
//           // as well as a placeholder for the popover itself.
//           let template =
//             `<button class="open" popoverTarget="${popoverId}" >
//               <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
//               <span>${item.pokemon.name}</span>
//               <img class="open" src="open.svg" />
//             </button>
//             <div popover id="${popoverId}">
//               <div class="profile">
//                 <p>Loading...</p>
//               </div>
//             </div>`
//           div.innerHTML = DOMPurify.sanitize(template)
//           // when the popover is opened, fetch details and build a profile
//           // we only do this when opened to avoid excessive API calls 
//           div.querySelector(`#${popoverId}`)
//             .addEventListener('toggle', async (event) => {
//               if (event.newState == 'open') {
//                 event.target.innerHTML = await createProfile(popoverId, item.pokemon.url)
//               }
//             })
//           // add this listing to the section for this type
//           section.appendChild(div)

//         })
//       // add this section to the main part of the page
//       document.querySelector('main').appendChild(section)
//     })
}


export { createListings }