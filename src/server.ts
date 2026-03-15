import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { StackOverflowProvider } from './providers/StackOverflowProvider';
import { MapperService } from './services/MapperService';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

export default app;