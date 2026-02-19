const { Pinecone } = require('@pinecone-database/pinecone')

const pc = new Pinecone({ apiKey: process.env.YOUR_API_KEY });

const nemoAiIndex = pc.index('nemo-gpt-ai')

async function createMemory({ vectors, metadata, messageId }) {
    //    if (!vectors || vectors.length === 0) {
    //     throw new Error("No vectors provided to Pinecone")
    // }
    await nemoAiIndex.upsert([{
        id: messageId,
        values: vectors,
        metadata
    }])
}

async function queryMemory({ queryVector, limit = 5, metadata }) {
    const data = await nemoAiIndex.query({
        vector: queryVector,
        topK: limit,
        filter: metadata ? { metadata } : undefined,
        includeMetadata: true
    })

    return data.matches
}

module.exports = {
    createMemory,
    queryMemory
}