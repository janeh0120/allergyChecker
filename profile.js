

// For the Full profile, we may like to control which image to show
// there are lots of images available. (take a look at the JSON in the console for details)
// I will use the "dream_world" image here by default, as it is a nice vector image,
// if not available we will use in order: dream_world, home, or just the ordinary pokeball.
const getProfileImageURL = (pokemon) => {
  const dream_world = pokemon.sprites?.other?.['dream_world']?.front_default
  const official = pokemon.sprites?.other?.['official-artwork']?.front_default
  const home = pokemon.sprites?.other?.['home']?.front_default
  return dream_world || official || home || 'pokeball.svg'
}


// Given the URL for a single pokemon, fetch details from the API
// and build a profile for the pokemon. 
// this includes a template populated with details 
// it also includes a close button.
const createProfile = async (popoverId, url) => {
  const data = await fetch(url)
  const pokemon = await data.json()
  const imageURL = getProfileImageURL(pokemon)
  // build a template to hold details for this pokemon 
  const template = ` 
  <div class="profile">
    <button class="close" popovertarget="${popoverId}"  >Close</button>
    <div class="details"> 
    
      <img src="${imageURL}" onError="this.src='pokeball.svg'"/>
      <div class="characteristics"> 
        <h2>${pokemon.name}</h2>
        <h3>
          <img src="pokeball.svg" style="width:16px;">
          ${pokemon.types.map(t => `<span class="${t.type.name}">${t.type.name}</span>`).join('<i> / </i>')}
        </h3>

        <fieldset>
          <label>Height</label>
          <meter value="${pokemon.height / 10}" min="0" max="10"></meter>
          <label>${pokemon.height / 10}m</label>
        </fieldset>

        <fieldset>
          <label>Weight</label>
          <meter value="${pokemon.weight / 10}" min="0" max="100"></meter>
          <label>${pokemon.weight / 10}kg</label> 
        </fieldset>

        <p>Abilities: ${pokemon.abilities.map(a => a.ability.name).join(', ')}</p> 
      </div>
       
    </div> 
    <div class="stats">
      ${pokemon.stats.map(stat => `
        <div class="stat">
          <div class="base-stat">${stat.base_stat}</div>
          <div class="stat-name">${stat.stat.name}</div> 
        </div>`).join(' ')}
    </div>
  </div>`
  return DOMPurify.sanitize(template)
}


export { createProfile }