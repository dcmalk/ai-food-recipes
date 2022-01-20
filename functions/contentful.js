//import fetch from "node-fetch"
import { createClient } from "contentful-management"
import { getPixabayImage } from "./lib/pixabay"
import { getRandomInt } from "./lib/utils"

const addContentfulImage = async (env, title, url) => {
  try {
    let asset = await env.createAsset({
      fields: {
        title: {
          "en-US": title,
        },
        file: {
          "en-US": {
            contentType: "image/jpeg",
            fileName: url.substring(url.lastIndexOf("/") + 1),
            upload: url,
          },
        },
      },
    })
    asset = await asset.processForAllLocales()
    return await asset.publish()
  } catch (error) {
    console.log("Error: Could not add image to Contentful", error)
    return false
  }
}

exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" }
  }

  const body = JSON.parse(event.body)
  const recipe = body.recipe

  try {
    const client = createClient({
      accessToken: process.env.CONTENTFUL_AUTH_TOKEN,
    })
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
    const environment = await space.getEnvironment("master")

    const image = await getPixabayImage(recipe.foods[0])
    if (!image) throw new Error("Cannot get Pixabay image")

    const asset = await addContentfulImage(environment, recipe.title, image)
    if (!asset) throw new Error("Cannot add Contentful image")

    const fields = {
      fields: {
        title: {
          "en-US": recipe.title,
        },
        cookTime: {
          "en-US": getRandomInt(5, 30),
        },
        description: {
          "en-US":
            `The main ingredients of this tasty recipe are ${recipe.foods
              .join(", ")
              .replace(/,(?!.*,)/gim, " and")}` +
            `. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cumque aperiam iusto commodi adipisci quasi delectus quis saepe in ea eaque sapiente maxime recusandae harum sit nulla reprehenderit eius, corrupti veniam. Bon appetit!`,
        },
        servings: {
          "en-US": getRandomInt(2, 8),
        },
        image: {
          "en-US": {
            sys: {
              id: asset.sys.id,
              linkType: "Asset",
              type: "Link",
            },
          },
        },
        featured: {
          "en-US": Math.random() < 0.2, // 20% chance of being featured
        },
        prepTime: {
          "en-US": getRandomInt(10, 30),
        },
        content: {
          "en-US": {
            tags: [...recipe.foods, ...recipe.mealtimes],
            tools: recipe.tools,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
          },
        },
      },
    }

    const entry = await environment.createEntry("recipe", fields)
    await entry.publish()

    return {
      statusCode: 200,
      body: JSON.stringify(entry),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
