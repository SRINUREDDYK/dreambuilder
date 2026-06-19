import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const dreamSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Career', 'Fitness', 'Business', 'Education', 'Travel', 'Finance']
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Medium', 'High']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  targetDate: {
    type: String,
    required: true
  },
  progress: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'In Progress',
    enum: ['In Progress', 'Completed']
  },
  user_id: {
    type: String, // String to make it uniform for both Mongo ObjectId and UUID fallback
    required: true
  }
}, { timestamps: true });

const MongooseDreamModel = mongoose.models.Dream || mongoose.model('Dream', dreamSchema);

const Dream = createModel('dreams', MongooseDreamModel);
export default Dream;
