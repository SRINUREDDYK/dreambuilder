import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const badgeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  requirementType: {
    type: String, // 'dream_created', 'habit_streak', 'progress_milestone', 'dream_completed'
    required: true
  },
  requirementValue: {
    type: Number,
    required: true
  }
}, { timestamps: true });

const MongooseBadgeModel = mongoose.models.Badge || mongoose.model('Badge', badgeSchema);

const Badge = createModel('badges', MongooseBadgeModel);
export default Badge;
