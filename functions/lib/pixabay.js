import fetch from "node-fetch"
import { getRandomInt } from "./utils"

export const getPixabayImage = async term => {
  if (!term) throw new Error("Search term required")

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${term}&per_page=10&image_type=photo`
    )
    const data = await response.json()
    const randInt = getRandomInt(0, data.hits.length - 1)
    return data.hits[randInt].webformatURL
  } catch (error) {
    console.log("Error: Could not get Pixabay image", error)
    return false
  }
}
