// Example generated recipe data
// const result = "title: strawberry chicken salad ingredients: 2 cups strawberries hulled and halved 2 cups cooked chicken shredded 1/2 cup peanuts chopped 1/2 cup mangos chopped directions: in a large bowl, toss together the strawberries, chicken, peanuts, and mangos. serve immediately or refrigerate until ready to serve."

export const parseAI = (result, foods) => {
  const data = result
    .replace("title", "")
    .replace("ingredients", "")
    .replace("directions", "")

  const [blank, title, ingredients, instructions] = data.split(":")
  const matchIngreds = ingredients.match(/([0-9]+)\s[A-Za-z]+[^0-9]+/g)
  const ingredientsArray = matchIngreds ? matchIngreds : foods
  const instructionsArray = instructions
    .split(".")
    .map(item => item.trim())
    .filter(item => item)
    .map(item => item + ".")

  return {
    title: title.trim(),
    ingredients: ingredientsArray,
    instructions: instructionsArray,
  }
}
