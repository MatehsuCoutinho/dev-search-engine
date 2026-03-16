export const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'DevSearch Engine API',
        version: '1.0.0',
        description:
            'Motor de busca unificado para desenvolvedores, consumindo a Stack Exchange API com cache via Meilisearch.',
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Local development server',
        },
    ],
    paths: {
        '/health': {
            get: {
                summary: 'Health check',
                description: 'Verifica se o servidor está rodando corretamente.',
                tags: ['Status'],
                responses: {
                    200: {
                        description: 'Servidor funcionando',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        status: { type: 'string', example: 'ok' },
                                        timestamp: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        '/search': {
            post: {
                summary: 'Buscar perguntas',
                description:
                    'Busca perguntas no Stack Overflow. Retorna resultados do cache (Meilisearch) se disponíveis, caso contrário busca na Stack Exchange API e indexa os resultados.',
                tags: ['Search'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['q'],
                                properties: {
                                    q: {
                                        type: 'string',
                                        description: 'Termo de busca',
                                        example: 'react hooks',
                                    },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description: 'Resultados encontrados',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        query: { type: 'string', example: 'react hooks' },
                                        total: { type: 'number', example: 10 },
                                        results: {
                                            type: 'array',
                                            items: {
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'string', example: 'so_123456' },
                                                    title: { type: 'string', example: 'How to use useEffect correctly?' },
                                                    content: { type: 'string', example: 'I am trying to...' },
                                                    url: { type: 'string', example: 'https://stackoverflow.com/questions/123456' },
                                                    author: { type: 'string', example: 'john_doe' },
                                                    tags: { type: 'array', items: { type: 'string' }, example: ['react', 'hooks'] },
                                                    score: { type: 'number', example: 42 },
                                                    isAnswered: { type: 'boolean', example: true },
                                                    viewCount: { type: 'number', example: 1500 },
                                                    createdAt: { type: 'string', example: '2024-01-01T00:00:00.000Z' },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    400: {
                        description: 'Parâmetro ausente ou inválido',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', example: 'Missing required parameter: q' },
                                        example: {
                                            type: 'object',
                                            properties: {
                                                url: { type: 'string', example: 'POST /search' },
                                                body: {
                                                    type: 'object',
                                                    properties: {
                                                        q: { type: 'string', example: 'react hooks' },
                                                    },
                                                },
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                    500: {
                        description: 'Erro interno do servidor',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        error: { type: 'string', example: 'Internal server error while processing your search' },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    },
};