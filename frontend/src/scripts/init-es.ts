import { Client } from '@elastic/elasticsearch';

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme',
  },
});

async function initIndex() {
  try {
    const exists = await esClient.indices.exists({ index: 'jobs' });
    if (exists) {
      console.log('Index "jobs" already exists. Deleting and recreating for new mapping...');
      await esClient.indices.delete({ index: 'jobs' });
    }

    await esClient.indices.create({
      index: 'jobs',
      body: {
        mappings: {
          properties: {
            title: { type: 'text' },
            description: { type: 'text' },
            skills: { type: 'keyword' },
            createdAt: { type: 'date' },
            vector: {
              type: 'dense_vector',
              dims: 384, // paraphrase-multilingual-MiniLM-L12-v2
              index: true,
              similarity: 'cosine'
            }
          }
        }
      }
    });

    console.log('Index "jobs" created successfully with semantic search mapping.');
  } catch (error) {
    console.error('Error initializing ES index:', error);
  }
}

initIndex();
