import { IStackOverflowItem } from '../interfaces/IStackOverflowResponse';
import { ISearchResult } from '../interfaces/ISearchResult';

export class MapperService {
    static fromStackOverflow(item: IStackOverflowItem): ISearchResult {
        return {
            id: `so_${item.question_id}`,
            title: item.title,
            content: item.body ?? '',
            url: item.link,
            author: item.owner?.display_name || 'Unknown',
            tags: item.tags ?? [],
            score: item.score,
            isAnswered: item.is_answered,
            viewCount: item.view_count,
            createdAt: new Date(item.creation_date * 1000).toISOString(),
        };
    }

    static manyFromStackOverflow(items: IStackOverflowItem[]): ISearchResult[] {
        return items.map((item) => this.fromStackOverflow(item));
    }
}