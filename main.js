import { createNavigation } from './navigation.js';
import { createListings } from './listings.js';

// fetch a simple list of all cafes
// This only includes the name and url for each.
const response = await fetch('https://api.geoapify.com/v2/places')
const json = await response.json()

console.log('List of Cafes', json.results)

// Let's get more details for each of the cafes
// this will include a list of member pokemon for each type  
// note the use of Promise.all to fetch all at once
const cafeDetails = await Promise.all(
  json.results.map(async (cafe) => {
    const data = await fetch(cafe.url)
    return data.json()
  })
)
console.log('Cafes with Details', cafeDetails)

// Now we can build the navigation menu and listings for each cafe
createNavigation(cafeDetails)
createListings(cafeDetails)

