import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const TAG_LENGTH = 16; // 128 bits

// Generate a random encryption key (in production, store this securely)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || crypto.randomBytes(KEY_LENGTH);

export interface EncryptedData {
  encrypted: string;
  iv: string;
  tag: string;
}

/**
 * Encrypt text using AES-256-GCM
 */
export function encrypt(text: string, password?: string): EncryptedData {
  const key = password ? crypto.scryptSync(password, 'salt', KEY_LENGTH) : ENCRYPTION_KEY;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipher(ALGORITHM, key);
  cipher.setAAD(Buffer.from('codedpadai', 'utf8'));
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

/**
 * Decrypt text using AES-256-GCM
 */
export function decrypt(encryptedData: EncryptedData, password?: string): string {
  const key = password ? crypto.scryptSync(password, 'salt', KEY_LENGTH) : ENCRYPTION_KEY;
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const tag = Buffer.from(encryptedData.tag, 'hex');
  
  const decipher = crypto.createDecipher(ALGORITHM, key);
  decipher.setAAD(Buffer.from('codedpadai', 'utf8'));
  decipher.setAuthTag(tag);
  
  let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

/**
 * Hash a passphrase using bcrypt
 */
export async function hashPassphrase(passphrase: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(passphrase, saltRounds);
}

/**
 * Verify a passphrase against its hash
 */
export async function verifyPassphrase(passphrase: string, hash: string): Promise<boolean> {
  return bcrypt.compare(passphrase, hash);
}

/**
 * Generate a secure random string for pad IDs
 */
export function generateSecureId(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
