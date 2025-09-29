// Let's build a navigation menu for all given types of pokemon 
const createNavigation = (pokemonTypes) => {
  // iterate over the list of pokemon types
  // filter out the ones that have no pokemon (e.g. "unknown", "shadow")
  pokemonTypes
    .filter(pokemonType => pokemonType.pokemon.length > 0)
    .forEach(pokemonType => {
      // make a button in the menu for this pokemon type
      const button = document.createElement('button')
      button.className = pokemonType.name
      button.textContent = pokemonType.name
      // when the button is clicked, show pokemon listings for this type
      // use the ".active" CSS class to show / hide pokemon
      button.addEventListener('click', () => {
        document.querySelectorAll(`section`)
          .forEach(el => el.classList.remove('active'))
        document.querySelectorAll(`section.${pokemonType.name}`)
          .forEach(el => el.classList.add('active'))
      })
      document.querySelector('nav').appendChild(button)
    })
}

export { createNavigation }
