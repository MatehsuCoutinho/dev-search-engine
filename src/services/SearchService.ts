import { StackOverflowProvider } from '../providers/StackOverflowProvider';
import { MeilisearchService } from './MeilisearchService';
import { MapperService } from './MapperService';
import { ISearchResult } from '../interfaces/ISearchResult';

export class SearchService {
    private stackOverflowProvider: StackOverflowProvider;
    private meilisearchService: MeilisearchService;

    constructor() {
        this.stackOverflowProvider = new StackOverflowProvider();
        this.meilisearchService = new MeilisearchService();
    }

    async search(query: string): Promise<ISearchResult[]> {
        // 1. Verifica se já existem resultados no Meilisearch
        const hasCache = !(await this.meilisearchService.isEmpty(query));

        if (hasCache) {
            console.log(`⚡ Returning cached results for: "${query}"`);
            return this.meilisearchService.search(query);
        }

        // 2. Busca na Stack Exchange API
        console.log(`🌐 Fetching from Stack Exchange API for: "${query}"`);
        const response = await this.stackOverflowProvider.search(query);

        if (!response.items || response.items.length === 0) {
            return [];
        }

        // 3. Normaliza os dados
        const mapped = MapperService.manyFromStackOverflow(response.items);

        // 4. Salva no Meilisearch
        await this.meilisearchService.upsert(mapped);

        // 5. Retorna os resultados
        return mapped;
    }
}