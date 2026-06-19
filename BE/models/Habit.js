import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const habitSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    default: 'Daily'
  },
  streak: {
    type: Number,
    default: 0
  },
  lastCompletedDate: {
    type: String, // YYYY-MM-DD
    default: ''
  },
  history: {
    type: [String], // Array of YYYY-MM-DD strings of completion dates
    default: []
  }
}, { timestamps: true });

const MongooseHabitModel = mongoose.models.Habit || mongoose.model('Habit', habitSchema);

const Habit = createModel('habits', MongooseHabitModel);
export default Habit;
