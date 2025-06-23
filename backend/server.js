import express from 'express';
import { downloadFile, preview, uploadFile } from './controllers/upload.controller.js';
import upload, { UPLOAD_DIR } from './middleware/upload.js';
import fs from 'fs';
import cors from 'cors';
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || 'Dev URL'
}))

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

app.post('/api/upload', upload.single('file'), uploadFile);
app.use('/uploads', express.static(UPLOAD_DIR));
app.get('/api/upload/:file/download', downloadFile);
app.get('/api/preview/:file', preview);


const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})

