// Let's build a navigation menu for all types of allergens
const createNavigation = (allergenTypes) => {
  // iterate over the list of allergen types
  // filter out the ones that have no allergens (e.g. "unknown", "shadow")
  allergenTypes
    .filter(allergenType => allergenType.allergens.length > 0)
    .forEach(allergenType => {
      // make a button in the menu for this allergen type
      const button = document.createElement('button')
      button.className = allergenType.name
      button.textContent = allergenType.name
      // when the button is clicked, show allergen listings for this type
      // use the ".active" CSS class to show / hide allergens
      button.addEventListener('click', () => {
        document.querySelectorAll(`section`)
          .forEach(el => el.classList.remove('active'))
        document.querySelectorAll(`section.${allergenType.name}`)
          .forEach(el => el.classList.add('active'))
      })
      document.querySelector('nav').appendChild(button)
    })
}

export { createNavigation }
