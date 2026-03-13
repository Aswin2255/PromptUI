import { v4 as uuidv4 } from 'uuid';

export async function generateUid() {
  try {
    const chatId = uuidv4();

    return chatId;
  } catch (err) {
    throw err;
  }
}
