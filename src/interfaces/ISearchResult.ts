export interface ISearchResult {
    id: string;
    title: string;
    content: string;
    url: string;
    author: string;
    tags: string[];
    score: number;
    isAnswered: boolean;
    viewCount: number;
    createdAt: string;
}