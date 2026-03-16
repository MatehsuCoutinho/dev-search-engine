import { Request, Response } from 'express';
import { SearchService } from '../services/SearchService';

const searchService = new SearchService();

export class SearchController {
    async search(req: Request, res: Response): Promise<void> {
        const query = req.body?.q as string;

        if (!query || query.trim() === '') {
            res.status(400).json({
                error: 'Missing required parameter: q',
                example: {
                    url: 'POST /search',
                    body: { q: 'react hooks' },
                },
            });
            return;
        }

        try {
            const results = await searchService.search(query.trim());

            res.json({
                query,
                total: results.length,
                results,
            });
        } catch (error) {
            console.error('❌ Search error:', error);
            res.status(500).json({
                error: 'Internal server error while processing your search',
            });
        }
    }
}