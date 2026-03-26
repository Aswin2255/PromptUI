import { model, models, Schema } from 'mongoose';

const UserchatSchema = new Schema(
  {
    user_id: {
      type: String,
      required: true,
    },
    chats: [
      {
        _id: {
          type: String,
          require: true,
        },
        title: {
          type: String,
          require: true,
        },
        createdAt: {
          type: Date,
          require: true,
          default: new Date(),
        },
      },
    ],
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

export const Userchat = models.Userchat || model('Userchat', UserchatSchema);
