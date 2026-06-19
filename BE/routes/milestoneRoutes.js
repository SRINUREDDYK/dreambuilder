import express from 'express';
import Milestone from '../models/Milestone.js';
import Dream from '../models/Dream.js';
import { protect } from '../middleware/auth.js';
import { checkAndAwardBadges } from '../utils/badgeEngine.js';

const router = express.Router();

// @desc    Toggle milestone completed state & update dream progress
// @route   PUT /api/milestones/:id/toggle
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    // Verify dream belongs to user
    const dream = await Dream.findById(milestone.dream_id);
    if (!dream || dream.user_id !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Toggle completion
    const updatedMilestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      { isCompleted: !milestone.isCompleted },
      { new: true }
    );

    // Recalculate dream progress
    const allMilestones = await Milestone.find({ dream_id: dream._id });
    const totalCount = allMilestones.length;
    const completedCount = allMilestones.filter(m => m.isCompleted).length;
    
    let progress = 0;
    if (totalCount > 0) {
      progress = Math.round((completedCount / totalCount) * 100);
    }

    const status = progress === 100 ? 'Completed' : 'In Progress';

    const updatedDream = await Dream.findByIdAndUpdate(
      dream._id,
      { progress, status },
      { new: true }
    );

    // Check badges (50% Completed, Dream Achieved)
    const newBadges = await checkAndAwardBadges(req.user._id);

    res.json({
      milestone: updatedMilestone,
      dreamProgress: updatedDream.progress,
      dreamStatus: updatedDream.status,
      newBadges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Add manual milestone
// @route   POST /api/milestones
router.post('/', protect, async (req, res) => {
  const { dream_id, title, month_or_phase } = req.body;

  try {
    if (!dream_id || !title) {
      return res.status(400).json({ message: 'Dream ID and Title are required' });
    }

    const dream = await Dream.findById(dream_id);
    if (!dream || dream.user_id !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Find highest order
    const existing = await Milestone.find({ dream_id });
    const maxOrder = existing.reduce((max, m) => m.order > max ? m.order : max, 0);

    const milestone = new Milestone({
      dream_id,
      title,
      month_or_phase: month_or_phase || 'Custom Phase',
      order: maxOrder + 1,
      isCompleted: false
    });

    const savedMilestone = await milestone.save();

    // Recalculate dream progress
    const allMilestones = await Milestone.find({ dream_id });
    const totalCount = allMilestones.length;
    const completedCount = allMilestones.filter(m => m.isCompleted).length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const status = progress === 100 ? 'Completed' : 'In Progress';

    const updatedDream = await Dream.findByIdAndUpdate(dream._id, { progress, status }, { new: true });

    res.status(201).json({ milestone: savedMilestone, dream: updatedDream });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete milestone
// @route   DELETE /api/milestones/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }

    const dream = await Dream.findById(milestone.dream_id);
    if (!dream || dream.user_id !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Milestone.deleteOne({ _id: milestone._id });

    // Recalculate progress
    const allMilestones = await Milestone.find({ dream_id: dream._id });
    const totalCount = allMilestones.length;
    const completedCount = allMilestones.filter(m => m.isCompleted).length;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    const status = progress === 100 ? 'Completed' : 'In Progress';

    await Dream.findByIdAndUpdate(dream._id, { progress, status });

    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
