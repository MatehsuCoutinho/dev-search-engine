export interface IStackOverflowItem {
    question_id: number;
    title: string;
    body: string;
    link: string;
    owner: {
        display_name: string;
    };
    tags: string[];
    score: number;
    is_answered: boolean;
    view_count: number;
    creation_date: number;
}

export interface IStackOverflowResponse {
    items: IStackOverflowItem[];
    has_more: boolean;
    quota_remaining: number;
}