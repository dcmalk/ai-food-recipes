import React, { useState } from "react"
import Layout from "../components/Layout"
import AddRecipe from "../components/AddRecipe"
import SEO from "../components/SEO"
import { parseAI } from "../lib/parser"
import { addContentfulRecipe } from "../lib/contentful"
import { getHuggingFaceRecipe } from "../lib/huggingface"

const Add = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const addRecipeHandler = async recipe => {
    setError(null)
    setIsLoading(true)

    try {
      const hfRecipe = await getHuggingFaceRecipe(recipe.foods)
      if (!hfRecipe.success) {
        setError(hfRecipe.error.message)
        setIsLoading(false)
        return
      }

      const generated = hfRecipe.data[0].generated_text
      if (generated) {
        const parsed = parseAI(generated)
        const recipeData = {
          ...recipe,
          ...parsed,
        }

        const newRecipe = await addContentfulRecipe(recipeData)
        if (!newRecipe.success) {
          setError(newRecipe.error.message)
          setIsLoading(false)
          return
        }
        console.log("title=", newRecipe.data.fields.title)
        // redirect to new recipe
      } else {
        throw new Error("Error: Could not generate recipe")
      }
    } catch (error) {
      setError(error.message)
    }

    setIsLoading(false)
  }

  return (
    <Layout>
      <SEO title="Add Recipe" />
      <main className="page">
        <section className="add-page">
          <article className="add-info">
            <h3>Add a New Recipe</h3>
            <p>
              Four dollar toast biodiesel plaid salvia actually pickled banjo
              bespoke mlkshk intelligentsia edison bulb synth.
            </p>
          </article>
          <article className="add-form">
            <h5>Select One or More Meal Types:</h5>
            <AddRecipe onAddRecipe={addRecipeHandler} />
          </article>
          {isLoading && !error && <div>Generating recipe...</div>}
          {error && <div className="alert">{error}</div>}
        </section>
      </main>
    </Layout>
  )
}

export default Add
