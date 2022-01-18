export const parseAI = result => {
  const data = result
    .replace("title", "")
    .replace("ingredients", "")
    .replace("directions", "")

  const [blank, title, ingredients, instructions] = data.split(":")
  const ingredientsArray = ingredients.match(/([0-9]+)\s[A-Za-z]+[^0-9]+/g)
  const instructionsArray = instructions
    .split(".")
    .map(item => item.trim() + ".")
    .filter(item => item)

  return {
    title: title.trim(),
    ingredients: ingredientsArray,
    instructions: instructionsArray,
  }
}
