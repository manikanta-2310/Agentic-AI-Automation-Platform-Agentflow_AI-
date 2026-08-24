const crypto = require('crypto');
const config = require('../config');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12; // 96 bits for GCM
const AUTH_TAG_LENGTH = 16;

function getEncryptionKey() {
  const secret = config.CREDENTIAL_ENCRYPTION_KEY || 'default-agentflow-secret-key-32b';
  return crypto.createHash('sha256').update(String(secret)).digest();
}

function encrypt(text) {
  if (!text) return null;
  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

function decrypt(cipherText) {
  if (!cipherText) return null;
  try {
    const parts = cipherText.split(':');
    if (parts.length !== 3) {
      throw new Error('Invalid cipher text format');
    }
    const [ivHex, authTagHex, encryptedHex] = parts;
    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, 'hex');
    const authTag = Buffer.from(authTagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH });
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    console.error('[EncryptionService] Decryption failed:', err.message);
    throw new Error('Failed to decrypt credential payload');
  }
}

module.exports = {
  encrypt,
  decrypt
};
