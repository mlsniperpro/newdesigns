import { pipeline } from '@xenova/transformers';


function dotProduct(a, b) {
  a = Array.isArray(a) ? a : Array.from(a);
  b = Array.isArray(b) ? b : Array.from(b);

  if (a.length !== b.length) {
    throw new Error('Vectors must be of the same length');
  }

  return a.map((_, i) => a[i] * b[i]).reduce((m, n) => m + n);
}


async function getEmbeddings(chunks) {
  const embedding_model = await pipeline(
    'feature-extraction',
    'Xenova/all-MiniLM-L6-v2',
  );
  const embeddingsWithChunks = await Promise.all(
    chunks.map(async (chunk) => {
      const embedding = await embedding_model(chunk, {
        pooling: 'mean',
        normalize: true,
      });
      return { chunk, embedding }; // Return both the chunk and its embedding
    }),
  );
  return embeddingsWithChunks;
}


function getSimilarity(embeddingsWithChunks, query_embedding) {
  const similarities = embeddingsWithChunks.map(({ embedding }) =>
    dotProduct(embedding.data, query_embedding.data),
  );
  return similarities;
}


function getSimilarDocs(similarities, docs) { 
  const similarDocs = similarities.map((similarity, index) => {
    return {
      similarity: similarity,
      doc: docs[index],
    }
  });
  return similarDocs;
}

function sortSimilarDocs(similarDocs, numDocs) {
  const sortedSimilarDocs = similarDocs.sort(
    (a, b) => b.similarity - a.similarity,
  );
  return sortedSimilarDocs.slice(0, numDocs); // Return only the specified number of documents
}

const getSimilarDocsFromChunks = async (chunks, query, numDocs) => {
  const embeddingsWithChunks = await getEmbeddings(chunks);
  const [query_embedding_obj] = await getEmbeddings([query]);
  const query_embedding = query_embedding_obj.embedding;
  const similarities = getSimilarity(embeddingsWithChunks, query_embedding);
  const similarDocs = getSimilarDocs(similarities, chunks);
  const sortedSimilarDocs = sortSimilarDocs(similarDocs, numDocs);
  return sortedSimilarDocs;
};

export { getSimilarDocsFromChunks };