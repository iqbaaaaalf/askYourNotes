import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb';
import { VECTOR_COLLECTION_NAME } from '../constants';
import { IVectorDbConfig } from '../model/model.interface';

class VectorDbClient extends ChromaClient {
	private embeddingFunction: OpenAIEmbeddingFunction;

	constructor(config: IVectorDbConfig) {
		super({
			path: config.baseUrl,
		});

		this.embeddingFunction = new OpenAIEmbeddingFunction({
			openai_api_key: config.embedderApiKey,
		});

		this.collection.bind(this);
		this.addCollection.bind(this);
		this.deleteCollection.bind(this);
	}

	collection(vectorCollectionName: VECTOR_COLLECTION_NAME) {
		return this.getCollection({
			name: vectorCollectionName,
			embeddingFunction: this.embeddingFunction,
		});
	}

	addCollection(vectorCollectionName: VECTOR_COLLECTION_NAME) {
		return this.createCollection({
			name: vectorCollectionName,
			embeddingFunction: this.embeddingFunction,
			metadata: {
				'hnsw:space': 'cosine',
			},
		});
	}

	dropCollection(vectorCollectionName: VECTOR_COLLECTION_NAME) {
		return this.deleteCollection({
			name: vectorCollectionName,
		});
	}
}

export default VectorDbClient;
