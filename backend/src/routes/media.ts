import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { readStore, writeStore } from '../services/storageService.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import type { MediaStore, MediaFile } from '../types/index.js';

const router = Router();

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|svg|mp4|webm|mov|pdf/;
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Type de fichier non autorisé : ${ext}`));
    }
  }
});

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

router.get('/', requireAuth, (_req: Request, res: Response): void => {
  const store = readStore<MediaStore>('media', { files: [] });
  res.json(store.files);
});

router.post('/upload', requireAuth, upload.single('file'), (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: 'Aucun fichier reçu' });
    return;
  }
  const store = readStore<MediaStore>('media', { files: [] });
  const apiUrl = process.env.API_URL || `http://localhost:${process.env.PORT || 3001}`;
  const mediaFile: MediaFile = {
    id: generateId(),
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    url: `${apiUrl}/uploads/${req.file.filename}`,
    uploadedAt: new Date().toISOString()
  };
  store.files.push(mediaFile);
  writeStore<MediaStore>('media', store);
  res.status(201).json(mediaFile);
});

router.delete('/:id', requireAuth, (req: Request, res: Response): void => {
  const store = readStore<MediaStore>('media', { files: [] });
  const file = store.files.find(f => f.id === req.params.id);
  if (!file) {
    res.status(404).json({ error: 'Fichier non trouvé' });
    return;
  }
  const filePath = path.join(UPLOADS_DIR, file.filename);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  store.files = store.files.filter(f => f.id !== req.params.id);
  writeStore<MediaStore>('media', store);
  res.json({ success: true });
});

export default router;
