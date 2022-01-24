// Randomize array in-place using Durstenfeld shuffle algorithm
export const shuffleArray = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

// Fetch with retries
export const fetchRetry = async (url, options, retries = 3, wait = 1000) => {
  try {
    const response = await fetch(url, options)
    if (response.ok) {
      return response //.json()
    }
    throw new Error("Error: Unable to fetch the data")
  } catch (error) {
    if (retries <= 0) {
      throw error
    }
    console.log("Retrying... ", retries)
    await new Promise(r => setTimeout(r, wait)) // sleep
    return fetchRetry(url, options, retries - 1, wait)
  }
}
