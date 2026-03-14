import { Schema, models, model } from 'mongoose';

const ChatSchema = new Schema(
  {
    chatsession_id: {
      type: String,
      required: true,
    },
    chat_message_id: {
      type: String,
      require: true,
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
    parrent_chatid: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export const Chat = models.Chat || model('Chat', ChatSchema);
