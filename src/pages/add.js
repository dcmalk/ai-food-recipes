import React, { useState } from "react"
import Layout from "../components/Layout"
import AddRecipe from "../components/AddRecipe"
import SEO from "../components/SEO"
import { parseAI } from "../lib/parser"
import { addContentfulRecipe } from "../lib/contentful"

const Add = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const addRecipeHandler = async recipe => {
    const inputs = recipe.foods.join(", ")
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: inputs,
      }),
    }

    setError(null)
    setIsLoading(true)

    try {
      // Generate a recipe
      const res = await fetch(
        `https://api-inference.huggingface.co/models/flax-community/t5-recipe-generation`,
        options
      )
      if (!res.ok) {
        if (res.status == 503) {
          setError(
            "The AI model is now loading. Please try generating again in about 60 seconds..."
          )
          return
        } else {
          throw new Error(res.statusText)
        }
      }
      const json = await res.json()

      // Parse and add the response
      if (json) {
        const parsed = parseAI(json[0].generated_text)
        const recipeData = {
          ...recipe,
          ...parsed,
        }
        const newRecipe = await addContentfulRecipe(recipeData)
        console.log("newRecipe", newRecipe)
        // redirect to new recipe
      }
    } catch (err) {
      setError("Error: Could not fetch data")
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
