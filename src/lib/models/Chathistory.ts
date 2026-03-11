import { Schema, models, model } from 'mongoose';

const ChatSchema = new Schema(
  {
    role: {
      type: String,
      enum: ['user', 'ai'],
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // time taken for response
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export const Chat = models.Chat || model('Chat', ChatSchema);
