function cosineSimilarity(a, b) {
  console.log('Length of a:', a.length);
  console.log('Length of b:', b.length);
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}
export const createEmbeddings = async ({ token, model, input }) => {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
    body: JSON.stringify({ input, model }),
  });

  const { error, data, usage } = await response.json();

  return data;
};
const getEmbeddings = async (chunks) => {
  const model = "text-embedding-ada-002"
  const embeddingsWithChunks = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await createEmbeddings({
        token: process.env.NEXT_PUBLIC_API_KEY,
        model: 'text-embedding-ada-002',
        input: chunk,
      });

      return { chunk, embedding };
    }),
  );
  return embeddingsWithChunks;
};

function getSimilarity(embeddingsWithChunks, query_embedding) {

  const similarities = embeddingsWithChunks.map(({ embedding }, index) => {
    console.log(`Processing embedding #${index + 1}`);
    // Access the embedding data from embeddingsWithChunks
    const embeddingData = embedding[0].embedding;
    try {
      return cosineSimilarity(embeddingData, query_embedding);

    } catch (error) {
      console.error(`Error processing embedding #${index + 1}:`, error.message);
      return null;
    }
  });
  console.log('Computed similarities:', similarities);
  return similarities;
}

function getSimilarDocs(similarities, docs) {
  const similarDocs = similarities.map((similarity, index) => {
    return {
      similarity: similarity,
      doc: docs[index],
    };
  });
  return similarDocs;
}

function sortSimilarDocs(similarDocs, numDocs) {
  const sortedSimilarDocs = similarDocs.sort(
    (a, b) => b.similarity - a.similarity,
  );
  return sortedSimilarDocs.slice(0, numDocs); // Return only the specified number of documents
}

const getSimilarDocsFromChunks = async (
  embeddingsWithChunks,
  query,
  numDocs,
) => {
  const [query_embedding_obj] = await getEmbeddings([query]);
  const query_embedding = query_embedding_obj.embedding[0].embedding;
  const similarities = getSimilarity(embeddingsWithChunks, query_embedding);
  console.log('SIMILARITIES: ', similarities)
  const chunks = embeddingsWithChunks.map(({ chunk }) => chunk);
  const similarDocs = getSimilarDocs(similarities, chunks);
  const sortedSimilarDocs = sortSimilarDocs(similarDocs, numDocs);
  return sortedSimilarDocs;
};
const contextRetriever = async (embeddingData, input) => {
  let texts;
  const docs = await getSimilarDocsFromChunks(embeddingData, input, 15);
  console.log('THE DOCS ARE: ', docs);
  texts = docs.map((doc) => doc.doc);
  texts = texts.join(' ');
  return texts;
};

export { getSimilarDocsFromChunks, getEmbeddings, contextRetriever };