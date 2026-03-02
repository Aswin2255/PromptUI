import crypto from 'crypto';
import { buffer } from 'stream/consumers';
export function hashedPassword(
  password: string,
  salt: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (er, key) => {
      if (er) reject(er);
      resolve(key.toString('hex'));
    });
  });
}
export async function comparePassword(
  password: string,
  salt: string,
  dbpassword: string,
) {
  const inputhashedPassword = await hashedPassword(password, salt);
  return crypto.timingSafeEqual(
    Buffer.from(inputhashedPassword, 'hex'),
    Buffer.from(dbpassword, 'hex'),
  );
}

export function generateSalt(): string {
  return crypto.randomBytes(64).toString('hex');
}
