# 🔍 DevSearch Engine

Motor de busca backend para desenvolvedores, unificando buscas no Stack Overflow com cache inteligente via Meilisearch.

## Como funciona

1. Você envia um `POST /search` com o termo desejado
2. O sistema verifica se já existem resultados no cache (Meilisearch)
3. Se sim → retorna instantaneamente do cache
4. Se não → busca na Stack Exchange API, normaliza, salva no cache e retorna

## Stack

- **Node.js** + **TypeScript**
- **Express** — servidor HTTP
- **Meilisearch** — busca full-text e cache
- **Axios** — integração com a Stack Exchange API
- **Docker** — infraestrutura containerizada
- **Jest** + **Supertest** — testes unitários e de integração
- **Swagger** — documentação interativa

## Arquitetura

```
src/
├── controllers/        # Entrada HTTP e validação
├── services/           # Lógica de negócio e orquestração
├── providers/          # Integração com APIs externas
├── interfaces/         # Contratos e tipos TypeScript
└── docs/               # Configuração do Swagger
```

O projeto segue o padrão de **Provider e Normalização**:

- **Provider** — realiza as chamadas à Stack Exchange API
- **Mapper** — converte os dados para o contrato único `ISearchResult`
- **Service** — decide entre cache ou busca externa
- **Controller** — recebe a requisição e retorna a resposta

## Pré-requisitos

- [Node.js](https://nodejs.org/) v18+
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

## Instalação

**1. Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/devsearch-engine.git
cd devsearch-engine
```

**2. Instale as dependências:**
```bash
npm install
```

**3. Configure as variáveis de ambiente:**
```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:
```env
MEILI_MASTER_KEY=sua_chave_aqui
MEILI_HOST=http://localhost:7700
PORT=3000
STACK_EXCHANGE_API_KEY=sua_api_key_aqui
```

**4. Suba o Meilisearch com Docker:**
```bash
docker-compose up -d
```

**5. Inicie o servidor:**
```bash
npm run dev
```

## Endpoints

### `POST /search`
Busca perguntas no Stack Overflow.

**Request:**
```json
{
  "q": "react hooks"
}
```

**Response:**
```json
{
  "query": "react hooks",
  "total": 10,
  "results": [
    {
      "id": "so_123456",
      "title": "How to use useEffect correctly?",
      "content": "...",
      "url": "https://stackoverflow.com/questions/123456",
      "author": "john_doe",
      "tags": ["react", "hooks"],
      "score": 42,
      "isAnswered": true,
      "viewCount": 1500,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### `GET /health`
Verifica se o servidor está rodando.

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Documentação

Com o servidor rodando, acesse a documentação interativa (Swagger) em:
```
http://localhost:3000/docs
```

## Testes

```bash
# Rodar todos os testes
npm test

# Modo watch
npm run test:watch

# Com cobertura
npm run test:coverage
```

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor em modo desenvolvimento |
| `npm run build` | Compila o TypeScript |
| `npm start` | Inicia o servidor compilado |
| `npm test` | Roda os testes |
| `npm run test:coverage` | Roda os testes com cobertura |

## Roadmap

- [ ] Expiração de cache automática
- [ ] Filtros por tags e `isAnswered`
- [ ] Ordenação por score, data e visualizações
- [ ] Dockerfile para o servidor
- [ ] Suporte a múltiplas fontes (GitHub Issues, Dev.to)
- [ ] API Key da Stack Exchange

## Licença

MIT
