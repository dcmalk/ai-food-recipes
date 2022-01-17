import { createClient } from "contentful-management"
import { getPixabayImage } from "../lib/pixabay"
import { getRandomInt } from "./utils"

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
  } catch (err) {
    console.log("Error: Could not add image to Contentful", err)
  }
}

export const addContentfulRecipe = async recipe => {
  try {
    const client = createClient({
      accessToken: process.env.CONTENTFUL_AUTH_TOKEN,
    })
    const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID)
    const environment = await space.getEnvironment("master")

    const image = await getPixabayImage(recipe.foods[0])
    const asset = await addContentfulImage(environment, recipe.title, image)

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
          "en-US": Math.random() < 0.1, // 10% chance of being featured
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

    let entry = await environment.createEntry("recipe", fields)
    return await entry.publish()
  } catch (err) {
    console.log("Error: Could not add recipe to Contentful", err)
  }
}
