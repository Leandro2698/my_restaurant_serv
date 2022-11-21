import { model, Schema } from 'mongoose';
import { User } from '../types';

const userSchema = new Schema<User>(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    restaurants: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
      },
    ],
  },
);

const User = model<User>('User', userSchema);

export default User;
