import fs from 'fs';
import path from 'path';
import { encrypt, decrypt } from './cryptoService.js';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string): string {
  return path.join(DATA_DIR, `${name}.enc`);
}

export function readStore<T>(name: string, defaultValue: T): T {
  ensureDataDir();
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return defaultValue;
  try {
    const raw = fs.readFileSync(fp, 'utf8');
    return decrypt(raw) as T;
  } catch {
    return defaultValue;
  }
}

export function writeStore<T extends object>(name: string, data: T): void {
  ensureDataDir();
  const encrypted = encrypt(data);
  fs.writeFileSync(filePath(name), encrypted, 'utf8');
}
