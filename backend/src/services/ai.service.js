const { GoogleGenAI } = require("@google/genai");

// The client gets the API key from the environment variable `GEMINI_API_KEY`.

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: content
  })

  return response.text
}

async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768
    }
  })

  if (!response.embeddings || response.embeddings.length === 0) {
    throw new Error("No embedding generated")
  }

  return response.embeddings[0].values
}

module.exports = {
  generateResponse,
  generateVector
}