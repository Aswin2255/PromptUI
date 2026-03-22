import { Schema, models, model } from 'mongoose';
export interface ICHAT extends Document {
  chatsession_id: string;
  chat_message_id: string;
  role: 'user' | 'ai';
  model: string;
  duration: number;
  content: string;
  parrent_chatid: string;
}

const ChatSchema = new Schema<ICHAT>(
  {
    chatsession_id: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    model: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // time taken for response
      required: true,
    },
    content: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export const Chat = models.Chat || model('Chat', ChatSchema);
