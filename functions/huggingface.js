import fetch from "node-fetch"

exports.handler = async event => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" }
  }

  const body = JSON.parse(event.body)
  const inputs = body.inputs.join(", ")

  try {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/flax-community/t5-recipe-generation",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        },
        body: JSON.stringify({ inputs }),
      }
    )
    const data = await response.json()

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    }
  }
}
