import { MeiliSearch } from 'meilisearch';
import { ISearchResult } from '../interfaces/ISearchResult';

const INDEX_NAME = 'search_results';

export class MeilisearchService {
    private client: MeiliSearch;

    constructor() {
        this.client = new MeiliSearch({
            host: process.env.MEILI_HOST || 'http://localhost:7700',
            apiKey: process.env.MEILI_MASTER_KEY,
        });
    }

    async ensureIndex(): Promise<void> {
        try {
            await this.client.getIndex(INDEX_NAME);
        } catch {
            // Índice não existe, vamos criar
            await this.client.createIndex(INDEX_NAME, { primaryKey: 'id' });

            const index = this.client.index(INDEX_NAME);

            // Atributos que podem ser buscados por texto
            await index.updateSearchableAttributes([
                'title',
                'content',
                'tags',
                'author',
            ]);

            // Atributos que podem ser usados como filtro
            await index.updateFilterableAttributes([
                'tags',
                'isAnswered',
                'score',
            ]);

            // Atributos que podem ser usados para ordenação
            await index.updateSortableAttributes([
                'score',
                'viewCount',
                'createdAt',
            ]);

            console.log(`✅ Meilisearch index "${INDEX_NAME}" created and configured`);
        }
    }

    async upsert(documents: ISearchResult[]): Promise<void> {
        const index = this.client.index(INDEX_NAME);
        await index.addDocuments(documents, { primaryKey: 'id' });
        console.log(`📥 ${documents.length} documents indexed in Meilisearch`);
    }

    async search(query: string): Promise<ISearchResult[]> {
        const index = this.client.index(INDEX_NAME);
        const result = await index.search<ISearchResult>(query);
        return result.hits;
    }

    async isEmpty(query: string): Promise<boolean> {
        const results = await this.search(query);
        return results.length === 0;
    }
}