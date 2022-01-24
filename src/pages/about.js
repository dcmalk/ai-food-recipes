import React from "react"
import { StaticImage } from "gatsby-plugin-image"
import { Link, graphql } from "gatsby"
import Layout from "../components/Layout"
import RecipesList from "../components/RecipesList"
import SEO from "../components/SEO"

const About = ({ data }) => {
  const recipes = data.allContentfulRecipe.nodes
  return (
    <Layout>
      <SEO title="About" />
      <main className="page">
        <section className="about-page">
          <article>
            <h2>Using advanced AI to generate tasty recipes</h2>
            <p>
              This project started as an exercise in Gatsby and evolved into an
              exploration of AI and serverless development.
            </p>
            <p>Here's how it works.</p>
            <p>
              GraphQL queries Contentful for recipe data and then Gatsby serves
              everything neatly as a static site.
            </p>
            <p>
              To generate a recipe, an AI trained on cooking recipes is used.
              It's seeded using random ingredients and after generation, a
              Pixabay image is chosen. Everything is then saved to Contentful at
              which point Netlify redeploys the site.
            </p>
            <p>For a look under the hood, check out the Github repo!</p>
            <div>
              <a
                href="https://github.com/dcmalk/ai-food-recipes"
                className="btn"
              >
                Go to repo
              </a>
            </div>
          </article>
          <StaticImage
            src="../assets/images/about.jpg"
            alt="Person Pouring Salt in Bowl"
            className="about-img"
            placeholder="blurred"
          />
        </section>
        <section className="featured-recipes">
          <h5>Check out these featured recipes!</h5>
          <RecipesList recipes={recipes} />
        </section>
      </main>
    </Layout>
  )
}

export const query = graphql`
  {
    allContentfulRecipe(filter: { featured: { eq: true } }) {
      nodes {
        id
        cookTime
        prepTime
        title
        image {
          gatsbyImageData(layout: CONSTRAINED, placeholder: BLURRED)
        }
      }
    }
  }
`

export default About
