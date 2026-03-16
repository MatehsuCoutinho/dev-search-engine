import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { StackOverflowProvider } from './providers/StackOverflowProvider';
import { MapperService } from './services/MapperService';
import { MeilisearchService } from './services/MeilisearchService';
import { SearchController } from './controllers/SearchController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Controllers
const searchController = new SearchController();

// Rotas
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/search', (req, res) => searchController.search(req, res));

// Inicializa o servidor
const meilisearchService = new MeilisearchService();

meilisearchService.ensureIndex().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log(`Search endpoint: http://localhost:${PORT}/search?q=your+query`);
    });
}).catch((err) => {
    console.error('❌ Failed to connect to Meilisearch:', err.message);
    process.exit(1);
});

export default app;