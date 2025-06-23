import multer from 'multer';
import path from 'path';

export const UPLOAD_DIR = path.join(path.resolve(), 'uploads');

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const name = file.originalname
            .toLowerCase()
            .replace(/\s+/g, '-');

        const finalName = `${Date.now()}-${name}`;
        cb(null, finalName);
    }
});

function fileFilter(_req, file, cb) {
    const isPdf = file.mimetype === 'application/pdf';
    const isImg = file.mimetype.startsWith('image/');
    const isVedio = file.mimetype.startsWith('video/');
    const ext = path.extname(file.originalname).toLowerCase();

    const imgExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg'];
    const videoExts = [
        '.mp4', '.mov', '.mkv', '.avi', '.webm', '.flv', '.wmv', '.mpeg', '.mpg'
    ]

    const extOk = ext === '.pdf' || imgExts.includes(ext) || videoExts.includes(ext);

    if ((isPdf || isImg || isVedio) && extOk) {
        cb(null, true);
    }
    else {
        cb(new Error('Only PDF or image files are allowed'));
    }
}

const upload = multer({
    storage,
    fileFilter: fileFilter,
    limits: { fileSize: 900 * 1024 * 1024 }
})

export default upload;