import crypto from 'crypto';

function getKey(): Buffer {
  const key = process.env.CRYPTO_KEY;
  if (!key || key.length !== 64) {
    throw new Error('CRYPTO_KEY must be a 64-character hex string (32 bytes). Run: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))"');
  }
  return Buffer.from(key, 'hex');
}

interface EncryptedPayload {
  iv: string;
  tag: string;
  data: string;
}

export function encrypt(obj: object): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const plaintext = JSON.stringify(obj);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final()
  ]);
  const tag = cipher.getAuthTag();
  const payload: EncryptedPayload = {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    data: encrypted.toString('hex')
  };
  return JSON.stringify(payload);
}

export function decrypt(raw: string): object {
  const key = getKey();
  const { iv, tag, data } = JSON.parse(raw) as EncryptedPayload;
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data, 'hex')),
    decipher.final()
  ]);
  return JSON.parse(decrypted.toString('utf8'));
}
