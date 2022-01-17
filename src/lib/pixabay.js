import { getRandomInt } from "./utils"

export const getPixabayImage = async term => {
  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${term}&per_page=10&image_type=photo`
    )
    const data = await response.json()
    const randImage = getRandomInt(0, data.hits.length - 1)
    return data.hits[randImage].webformatURL
  } catch (err) {
    console.log("Error: Could not fetch Pixabay image", err)
  }
}
