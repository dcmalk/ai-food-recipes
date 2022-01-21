export const getHuggingFaceRecipe = async inputs => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ inputs }),
  }
  try {
    const response = await fetch("/.netlify/functions/huggingface", options)
    if (!response.ok) {
      if (response.status == 503) {
        throw new Error(
          "The AI model is now loading. Please try generating again in about 60 seconds..."
        )
      } else {
        throw new Error(`${response.status} ${response.statusText}`)
      }
    }

    return {
      success: true,
      data: await response.json(),
    }
  } catch (error) {
    return {
      success: false,
      error,
    }
  }
}
