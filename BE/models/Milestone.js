import mongoose from 'mongoose';
import { createModel } from '../config/db.js';

const milestoneSchema = new mongoose.Schema({
  dream_id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  month_or_phase: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const MongooseMilestoneModel = mongoose.models.Milestone || mongoose.model('Milestone', milestoneSchema);

const Milestone = createModel('milestones', MongooseMilestoneModel);
export default Milestone;
