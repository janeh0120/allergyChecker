//Developed using Co-Pilot and ChatGPT by Jane Hou
//Code starting point: https://github.com/ixd-system-design/PokemonTypes written by Harold Sikkema

// To understand the structure of the data, check the console log in the browser.
const createListings = () => {
  // Geoapify API integration for listing cafes and bubble tea places with allergen filters

  const API_KEY = "45ac13a7c2764f6880bc0a63095448e3";
  const BASE_URL = "https://api.geoapify.com/v2/places";
  // const DEFAULT_LOCATION = "circle:-79.698788,43.469814,10000"; // 10km radius
    const DEFAULT_LOCATION = "circle:-74.0060,40.7128,10000"; // 10km radius
  const DEFAULT_CATEGORIES = ["catering.cafe", "catering.restaurant", "catering.fast_food"]; // cafes and bubble tea places
  const ALLERGENS = [
    { label: "Vegetarian", value: "vegetarian" },
    { label: "Vegan", value: "vegan" },
    { label: "Halal", value: "halal" },
    { label: "Kosher", value: "kosher" },
    { label: "Organic", value: "organic" },
    { label: "Gluten Free", value: "gluten_free" },
    { label: "Sugar Free", value: "sugar_free" },
    { label: "Egg Free", value: "egg_free" },
    { label: "Soy Free", value: "soy_free" },
  ];
  const TYPE = [
    { label: "Restaurant", value: "catering.restaurant" },
    { label: "Fast Food", value: "catering.fast_food" },
    { label: "Cafe", value: "catering.cafe" },
    { label: "Bar", value: "catering.bar" },
  ];

  // Render allergen filter tags
function renderAllergenFilters(selectedAllergens = []) {
  const filterDiv = document.getElementById("allergen-filters");
  if (!filterDiv) return;
  filterDiv.innerHTML = ALLERGENS.map(a => `
    <span class="filter-tag allergen-tag${selectedAllergens.includes(a.value) ? ' active' : ''}" data-value="${a.value}">
      <span class="tag-label">${a.label}</span>
      <img src="images/exit.svg" class="exit-icon" alt="remove filter" style="display:${selectedAllergens.includes(a.value) ? 'inline' : 'none'}; width:0.6rem; margin-left:0.4rem; vertical-align:middle;"/>
    </span>
  `).join(" ");
}


function renderTypeFilters(selectedTypes = TYPE.map(t => t.value)) { // 👈 Preselect all by default
  const typeFilterDiv = document.getElementById("type-filters");
  if (!typeFilterDiv) return;
  typeFilterDiv.innerHTML = TYPE.map(t => `
    <span class="filter-tag type-tag${selectedTypes.includes(t.value) ? ' active' : ''}" data-value="${t.value}">
      <span class="tag-label">${t.label}</span>
      <img src="images/exit.svg" class="exit-icon" alt="remove filter"
        style="display:${selectedTypes.includes(t.value) ? 'inline' : 'none'};
        width:0.6rem; margin-left:0.4rem; vertical-align:middle;"/>
    </span>
  `).join(" ");
}


  // Fetch places from Geoapify
  async function fetchPlaces(selectedAllergens = []) {
    const params = new URLSearchParams({
      apiKey: API_KEY,
      filter: DEFAULT_LOCATION,
      categories: DEFAULT_CATEGORIES,
      limit: 50,
    });
    if (selectedAllergens.length > 0) {
      params.append("conditions", selectedAllergens.join(","));
    }
    const url = `${BASE_URL}?${params.toString()}`;
    console.log("Geoapify API URL:", url);
    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("Geoapify API data:", data);
      return data.features || [];
    } catch (err) {
      console.error("Geoapify fetch error:", err);
      const listDiv = document.getElementById("places-list");
      if (listDiv) {
        listDiv.innerHTML = "<p style='color:red'>Failed to fetch cafes. Please try again later.</p>";
      }
      return [];
    }
  }


// Render places as a list, filtered by selected types
function renderPlaces(places, selectedTypes = TYPE.map(t => t.value)) {
  const listDiv = document.getElementById("places-list");
  if (!listDiv) return;

  if (places.length === 0) {
    listDiv.innerHTML = "<p>No results found.</p>";
    return;
  }

  listDiv.innerHTML = places
    .filter(f => {
      const p = f.properties;
      return (p.categories || []).some(cat => selectedTypes.includes(cat));
    })
    .map(f => {
      const p = f.properties;

      // Show only TYPE tags
      const tags = (p.categories || []).filter(cat => TYPE.map(t => t.value).includes(cat));

      // Allergen tags
      const allergenTags = ALLERGENS
        .filter(a => (p.conditions && p.conditions.includes && p.conditions.includes(a.value)) || p[a.value] === true)
        .map(a => `<span class="allergen-tag">${a.label}</span>`);

      // Cuisine handling (Geoapify may return string or array)
      let cuisines = p.datasource?.raw?.cuisine || [];
      if (typeof cuisines === "string") {
        cuisines = cuisines.split(";").map(c => c.trim());
      }

      //  Map cuisines and categories to images
      const categoryImages = {
        "bubble_tea": "images/bubble-tea.svg",
        "coffee": "images/coffee.svg",
        "coffee_shop": "images/coffee.svg",
        "mediterranean": "images/mediterranean-shawarma.svg",
        "lebanese": "images/mediterranean-shawarma.svg",
        "breakfast": "images/breakfast.svg",
        "fast_food": "images/fast-food.svg",
        "american": "images/fast-food.svg",
        "burger": "images/fast-food.svg",
        "indian": "images/indian.svg",
        "tex-mex": "images/taco-texmex.svg",
        "taco": "images/taco-texmex.svg",
        "empanada": "images/taco-texmex.svg",
        "mexican": "images/taco-texmex.svg",
        "bar_and_grill": "images/bar&grill.svg",
        "steak_house": "images/bar&grill.svg",
        "italian": "images/pizza-italian.svg",
        "pizza": "images/pizza-italian.svg",
        "thai": "images/thai.svg",
        "cake": "images/cake.svg",
        "chinese": "images/chinese.svg",
      };

      // Pick the FIRST cuisine in order that exists in categoryImages
      let chosenCuisine = "";
      let imgSrc = "";
      for (const c of cuisines) {
        if (categoryImages[c]) {
          chosenCuisine = c;
          imgSrc = categoryImages[c];
          break;
        }
      }

      // If no cuisine image found, fallback to type
      if (!imgSrc && tags.length) {
        const typeObj = TYPE.find(t => t.value === tags[0]);
        if (typeObj) {
          imgSrc = categoryImages[typeObj.label.toLowerCase()] || "images/restaurant.svg";
        }
      }

      // Final fallback
      if (!imgSrc) imgSrc = "pokeball.svg";

      return `
        
        <div class="card-bg">
        <div class="place-item">
        <div class="card-text">
            <h3>${p.name || "Unnamed"}</h3>
            <div class="location">
              <img src="images/pin.svg" style="width: 1rem; vertical-align: middle;" alt="location icon"/>
              <p>${p.address_line2 || "No address"}</p>
            </div>
            ${p.website ? `
  <div class="website">
    <a href="${p.website}" target="_blank" class="website-link">
    Visit Website
      <img src="images/open.svg" alt="open link" style="width: 1rem; vertical-align: middle; margin-right: 0.3rem;"/>
      
    </a>
  </div>
` : ""}

            </div>
          <img src="${imgSrc}" alt="${chosenCuisine || 'Placeholder'}" class="place-image" />
          </div>
        </div>
      `;
    }).join("");
}


  // Handle allergen and type filter changes
  let lastPlaces = [];
  let selectedTypeFilters = TYPE.map(t => t.value);
  async function handleFilterChange() {
  // Get selected allergens and types from active tags
  const checkedAllergens = Array.from(document.querySelectorAll('.allergen-tag.filter-tag.active')).map(tag => tag.getAttribute('data-value'));
  const checkedTypes = Array.from(document.querySelectorAll('.type-tag.filter-tag.active')).map(tag => tag.getAttribute('data-value'));
  selectedTypeFilters = checkedTypes.length ? checkedTypes : TYPE.map(t => t.value);
  const places = await fetchPlaces(checkedAllergens);
  lastPlaces = places;
  renderPlaces(places, selectedTypeFilters);
  }

  // Handle type filter only (no new fetch)
  function handleTypeFilterOnly() {
  const checkedTypes = Array.from(document.querySelectorAll('.type-tag.filter-tag.active')).map(tag => tag.getAttribute('data-value'));
  selectedTypeFilters = checkedTypes.length ? checkedTypes : TYPE.map(t => t.value);
  renderPlaces(lastPlaces, selectedTypeFilters);
  }

  // Initialize immediately
  async function init() {
  renderAllergenFilters();
    // Add type filter container if not present
    let typeFilterDiv = document.getElementById("type-filters");
    if (!typeFilterDiv) {
      typeFilterDiv = document.createElement("div");
      typeFilterDiv.id = "type-filters";
      typeFilterDiv.className = "filters";
      const allergenDiv = document.getElementById("allergen-filters");
      if (allergenDiv && allergenDiv.parentNode) {
        allergenDiv.parentNode.insertBefore(typeFilterDiv, allergenDiv);
      }
    }
    renderTypeFilters();
    document.getElementById("allergen-filters").addEventListener("click", function(e) {
  const tag = e.target.closest('.filter-tag');
  if (tag) {
    tag.classList.toggle('active');
    const icon = tag.querySelector('.exit-icon');
    if (icon) icon.style.display = tag.classList.contains('active') ? 'inline' : 'none';
    handleFilterChange();
  }
});

document.getElementById("type-filters").addEventListener("click", function(e) {
  const tag = e.target.closest('.filter-tag');
  if (tag) {
    tag.classList.toggle('active');
    const icon = tag.querySelector('.exit-icon');
    if (icon) icon.style.display = tag.classList.contains('active') ? 'inline' : 'none';
    handleTypeFilterOnly();
  }
});

    const places = await fetchPlaces();
    lastPlaces = places;
    renderPlaces(places);
  }
  init();

}


export { createListings }