import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  badges: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

const MongooseUserModel = mongoose.models.User || mongoose.model('User', userSchema);

const User = createModel('users', MongooseUserModel);
export default User;
