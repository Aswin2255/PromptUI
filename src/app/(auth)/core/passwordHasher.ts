import crypto from 'crypto';
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

export function generateSalt(): string {
  return crypto.randomBytes(64).toString('hex');
}
