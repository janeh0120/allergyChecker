import { createProfile } from './profile.js';

// Let's create pokemon listings for each type 
// We receive as input all types of Pokemon including a list of its members 
// To understand the structure of the data, check the console log in the browser.
const createListings = (pokemonTypes) => {

  // iterate over the list of pokemon types
  // filter out the ones that have no pokemon (e.g. "unknown", "shadow")
  pokemonTypes
    .filter(pokemonType => pokemonType.pokemon.length > 0)
    .forEach(pokemonType => {
      // add a section to the page to hold pokemon of this type
      const section = document.createElement('section')
      section.classList.add(pokemonType.name)
      // Iterate over the list of members for this type. 
      // Members live inside a nested "pokemon" array 
      pokemonType.pokemon
        .forEach(item => {
          // get the ID from the URL for this pokemon
          // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
          const id = item.pokemon.url.split('/').filter(e => Number(e)).pop()
          // Skip any pokemon with an ID > 10000 
          // NOTE: these IDs are alternate forms that often lack images
          if (id > 10000) return
          // get a sprite icon directly from GitHub based on the ID  
          const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
          // assign a unique ID to the popover accounting for pokemon having multiple types
          const popoverId = `${pokemonType.name}-${id}`
          // make a div / template for each listing. 
          const div = document.createElement('div')
          div.classList.add('listing')
          // the template includes a button to open the popover
          // as well as a placeholder for the popover itself.
          let template =
            `<button class="open" popoverTarget="${popoverId}" >
              <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
              <span>${item.pokemon.name}</span>
              <img class="open" src="open.svg" />
            </button>
            <div popover id="${popoverId}">
              <div class="profile">
                <p>Loading...</p>
              </div>
            </div>`
          div.innerHTML = DOMPurify.sanitize(template)
          // when the popover is opened, fetch details and build a profile
          // we only do this when opened to avoid excessive API calls 
          div.querySelector(`#${popoverId}`)
            .addEventListener('toggle', async (event) => {
              if (event.newState == 'open') {
                event.target.innerHTML = await createProfile(popoverId, item.pokemon.url)
              }
            })
          // add this listing to the section for this type
          section.appendChild(div)

        })
      // add this section to the main part of the page
      document.querySelector('main').appendChild(section)
    })
}


export { createListings }

