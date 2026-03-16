import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StackOverflowProvider } from './providers/StackOverflowProvider';
import { MapperService } from './services/MapperService';
import { MeilisearchService } from './services/MeilisearchService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const meilisearchService = new MeilisearchService();

meilisearchService.ensureIndex().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch((err) => {
    console.error('❌ Failed to connect to Meilisearch:', err.message);
    process.exit(1);
});

export default app;