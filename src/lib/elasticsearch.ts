import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
  },
});

interface Skill {
  name: string;
}

interface JobToIndex {
  id: string;
  title: string;
  description: string;
  skills: Skill[];
  createdAt: Date | string;
}

// ✅ #4.1 AI сервисээс вектор (embedding) авах
const getEmbedding = async (text: string): Promise<number[]> => {
  try {
    const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:8000';
    const res = await fetch(`${aiServiceUrl}/embed`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10000), // 10 секундын timeout
    });
    if (!res.ok) throw new Error('AI service error');
    const { embedding } = await res.json();
    return embedding;
  } catch (error) {
    console.error('[getEmbedding Error]:', error);
    return new Array(384).fill(0); // Fallback
  }
};

export const indexJob = async (job: JobToIndex) => {
  const textToEmbed = `${job.title}. ${job.description}. Skills: ${job.skills.map((s) => s.name).join(', ')}`;
  const vector = await getEmbedding(textToEmbed);

  return await esClient.index({
    index: 'jobs',
    id: job.id,
    document: {
      title: job.title,
      description: job.description,
      skills: job.skills.map((s) => s.name),
      createdAt: job.createdAt,
      vector, // ✅ Semantic search-д зориулсан вектор
    },
  });
};

export const searchJobs = async (query: string, useSemantic: boolean = true) => {
  if (!useSemantic) {
    // Keyword search (Хуучин)
    const result = await esClient.search({
      index: 'jobs',
      query: {
        multi_match: {
          query,
          fields: ['title', 'description', 'skills'],
        },
      },
    });
    return result.hits.hits.map(hit => hit._source);
  }

  // ✅ #4.1 Semantic Search (KNN)
  const queryVector = await getEmbedding(query);
  
  const result = await esClient.search({
    index: 'jobs',
    knn: {
      field: 'vector',
      query_vector: queryVector,
      k: 10,
      num_candidates: 100,
    },
    _source: {
      excludes: ['vector'] // Векторыг хариунд харуулахгүй (хэмжээ их)
    }
  });

  return result.hits.hits.map(hit => hit._source);
};

export default esClient;
