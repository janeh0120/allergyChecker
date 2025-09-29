# Pokemon Types 

## Context
This demo illustrates how we can make multiple fetches on one page. We first fetch a list of pokemon types, followed by details for each. We then populate the navigation and the listings using the fetched data. Finally, we connect each listing to an additional profile function that makes a further fetch for individual details. These details are shown in a popover and are loaded as needed. This example uses JavaScript modules, in order to keep the code organized. Data fetched from the [PokeAPI](https://pokeapi.co)

## Learning Prompts

### Promises in JavaScript
When using fetch, we often have to wait for the network to respond. In JavaScript, we can use `Promises` to account for this waiting. Notably, the `fetch()` function returns a `Promise`. To handle this, one may use `async / await` syntax. This is more modern, and works well when using modules. However you may also encounter an alternate `.then()` syntax to accomplish a similar goal. 
- Can you work out how `await` is used in this demo, and why it is important?
- Can you also work our how Promises are handled when there are multiple fetches happening at the same time?

### Templates within Templates
If you have an array of elements nested inside an object, you may like to iterate over each one so that it has its own distinct treatment, within the larger context. 
- Can you find a place in this Pokemon example where nested templates are used? 
- What is the relevance of the `.map()` Array function in JavaScript when it comes to nested templates?
- What is the relevance of the `.join()` Array function in JavaScript here?

### Building layouts
In this example the layout may appear differently on Mobile compared to on Desktop.
- How can you use media queries to make layouts more responsive?
- How do you know when to use CSS Grid, vs CSS Flexbox?

## UML Use Case Diagram
Check out the [UML Use Case Diagram](https://www.figma.com/community/file/1551984417684800177) for this demo on Figma.

