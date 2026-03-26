import { model, models, Schema } from 'mongoose';

const ChatSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    history: [
      {
        role: {
          type: String,
          enum: ['user', 'ai'],
        },
        message: {
          type: String,
          require: true,
        },
        model: {
          type: String,
          require: true,
        },
        duration: {
          type: String,
          require: false,
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export const Chat = models.Chat || model('Chat', ChatSchema);
