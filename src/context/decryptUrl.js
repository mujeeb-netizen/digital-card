import crypto from 'crypto';

export const decryptUrl = (encryptedUrl, secretKey) => {
  const decipher = crypto.createDecipher('aes-256-cbc', secretKey);
  let decryptedUrl = decipher.update(decodeURIComponent(encryptedUrl), 'hex', 'utf-8');
  decryptedUrl += decipher.final('utf-8');
  return decryptedUrl;
};