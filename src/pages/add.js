import React, { useState } from "react"
import Layout from "../components/Layout"
import AddRecipe from "../components/AddRecipe"
import SEO from "../components/SEO"
import { parseAI } from "../lib/parser"
import { addContentfulRecipe } from "../lib/contentful"
import { getHuggingFaceRecipe } from "../lib/huggingface"
import { fetchRetry } from "../lib/utils"

const Add = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("")
  const [error, setError] = useState(null)

  const addRecipeHandler = async recipe => {
    setError(null)
    setIsLoading(true)

    try {
      setLoadingMsg("Generating recipe...")
      const hfRecipe = await getHuggingFaceRecipe(recipe.foods)
      if (!hfRecipe.success) {
        setError(hfRecipe.error.message)
        setIsLoading(false)
        return
      }

      setLoadingMsg("Parsing results...")
      const generated = hfRecipe.data[0].generated_text
      if (generated) {
        const parsed = parseAI(generated, recipe.foods)
        const recipeData = {
          ...recipe,
          ...parsed,
        }

        setLoadingMsg("Adding to Contentful...")
        const newRecipe = await addContentfulRecipe(recipeData)
        if (!newRecipe.success) {
          setError(newRecipe.error.message)
          setIsLoading(false)
          return
        }

        const origin = window.origin
        const title = newRecipe.data.fields.title["en-US"]
        const newUrl = `${origin}/${title.replaceAll(" ", "-")}`

        setLoadingMsg(`Deploying to ${newUrl}...`)
        const deployed = await fetchRetry(newUrl, {}, 10, 30000)
        if (deployed.ok) {
          window.location.href = newUrl
        }
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
              To have our robots dream up a brand new recipe, select one or more
              meal types and click Generate. The AI will then pick some
              ingredients and put together instructions for creating a tasty new
              food recipe!
            </p>
            <p>
              Behind the scenes, there's a lot going on. The entire process may
              take up to five minutes. As a hobby project, I'm using free
              services (i.e. slow) and a tech stack chosen more for
              experimentation than performance.
            </p>
            <p> Please be patient, and enjoy the results :)</p>
          </article>
          <article className="add-form">
            <h5>Select One or More Meal Types:</h5>
            <AddRecipe onAddRecipe={addRecipeHandler} isLoading={isLoading} />
          </article>
          {isLoading && !error && (
            <div>
              {loadingMsg}
              <div className="loading" />
            </div>
          )}
          {error && <div className="alert">{error}</div>}
        </section>
      </main>
    </Layout>
  )
}

export default Add
