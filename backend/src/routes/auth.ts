import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readStore, writeStore } from '../services/storageService.js';
import type { AuthStore } from '../types/index.js';

const router = Router();

const DEFAULT_PASSWORD = 'oefic2024';

function getAuthStore(): AuthStore {
  return readStore<AuthStore>('auth', { passwordHash: '' });
}

async function ensureDefaultPassword(): Promise<void> {
  const store = getAuthStore();
  if (!store.passwordHash) {
    const hash = await bcrypt.hash(DEFAULT_PASSWORD, 12);
    writeStore<AuthStore>('auth', { passwordHash: hash });
    console.log('✅ Mot de passe admin initial créé : oefic2024 (changez-le dans le backoffice)');
  }
}

ensureDefaultPassword().catch(console.error);

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { password } = req.body as { password: string };
  if (!password) {
    res.status(400).json({ error: 'Mot de passe requis' });
    return;
  }
  const store = getAuthStore();
  const valid = await bcrypt.compare(password, store.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Mot de passe incorrect' });
    return;
  }
  const token = jwt.sign({ sub: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '8h' });
  res.json({ token });
});

router.post('/change-password', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé' });
    return;
  }
  try {
    jwt.verify(authHeader.slice(7), process.env.JWT_SECRET!);
  } catch {
    res.status(401).json({ error: 'Token invalide' });
    return;
  }
  const { currentPassword, newPassword } = req.body as { currentPassword: string; newPassword: string };
  const store = getAuthStore();
  const valid = await bcrypt.compare(currentPassword, store.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Mot de passe actuel incorrect' });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères' });
    return;
  }
  const hash = await bcrypt.hash(newPassword, 12);
  writeStore<AuthStore>('auth', { passwordHash: hash });
  res.json({ success: true });
});

export default router;
