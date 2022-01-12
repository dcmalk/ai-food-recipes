const setupTags = recipes => {
  const allTags = {}
  recipes.forEach(recipe => {
    recipe.content.tags.forEach(tags => {
      if (allTags[tags]) {
        allTags[tags] += 1
      } else {
        allTags[tags] = 1
      }
    })
  })
  const newTags = Object.entries(allTags).sort((a, b) => {
    const [firstTag] = a
    const [secondTag] = b
    return firstTag.localeCompare(secondTag)
  })
  return newTags
}

export default setupTags
