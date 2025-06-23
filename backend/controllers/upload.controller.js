import path from 'path';
import fs from 'fs';
import { UPLOAD_DIR } from '../middleware/upload.js';

export const uploadFile = (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file received" });

    let url, bytes, mb, host, isVideo, previewUrl, storedAs;

    try {
        url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        bytes = req.file.size;
        mb = (bytes / (1024 * 1024)).toFixed(2);

        host = `${req.protocol}://${req.get('host')}`;
        storedAs = req.file.filename;
        isVideo = req.file.mimetype.startsWith('video/');
        previewUrl = isVideo
            ? `${host}/api/preview/${encodeURIComponent(storedAs)}`
            : `${host}/uploads/${encodeURIComponent(storedAs)}`;
    } catch (err) {
        res.status(500).json({ message: "Something went wrong in uploading file", error: err.message });
    }
    
    const downloadUrl = `http://localhost:5000/api/upload/${req.file.filename}/download`
    res.set('Access-Control-Expose-Headers', 'Content-Disposition'); // CORS

    res.status(201).json({
        message: 'File uploaded successfully',
        URL: url,
        downloadFile: downloadUrl,
        previewUrl: previewUrl,
        storedAs: req.file.filename,
        size: parseFloat(mb) + ' MB',
        mime: req.file.mimetype
    });
}

export const downloadFile = (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.file);
    res.download(filePath);
    console.log("file downloaded");
}

const VIDEO_DIR = path.join(process.cwd(), 'uploads');

export const preview = (req, res) => {
    const filename = path.basename(req.params.file);
    const fullPath = path.join(VIDEO_DIR, filename);

    fs.stat(fullPath, (err, stats) =>{
        if(err || !stats.isFile()) return res.sendStatus(404);

        const range = req.headers.range;
        const mime = 'video/' + path.extname(filename).slice(1);

        if (!range) {
            res.writeHead(200, {
                'Content-Type': mime,
                'Content-Length': stats.size,
                'Accept-Ranges': 'bytes'
            });
            return fs.createReadStream(fullPath).pipe(res);
        }

        const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
        const start = parseInt(startStr, 10);
        const end = endStr ? parseInt(endStr, 10) : stats.size - 1;

        if (isNaN(start) || start >= stats.size || start < 0) {
            return res.status(416)
                .set('Content-Range', `bytes */${stats.size}`)
                .end();
        }

        res.writeHead(206, {
            'Content-Type': mime,
            'Content-Length': end - start + 1,
            'Content-Range': `bytes ${start}-${end}/${stats.size}`,
            'Accept-Ranges': 'bytes'
        });

        fs.createReadStream(fullPath, { start, end }).pipe(res);
    });
}