export const addContentfulRecipe = async recipe => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ recipe }),
  }
  try {
    const response = await fetch("/api/contentful", options)
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`)
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
