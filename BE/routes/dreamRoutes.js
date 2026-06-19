import express from 'express';
import Dream from '../models/Dream.js';
import Milestone from '../models/Milestone.js';
import { protect } from '../middleware/auth.js';
import { generateRoadmap } from '../services/roadmapService.js';
import { checkAndAwardBadges } from '../utils/badgeEngine.js';

const router = express.Router();

// @desc    Create a new dream & auto-generate milestones/roadmap
// @route   POST /api/dreams
router.post('/', protect, async (req, res) => {
  const { title, category, priority, difficulty, targetDate } = req.body;

  try {
    if (!title || !category || !priority || !difficulty || !targetDate) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const dream = new Dream({
      title,
      category,
      priority,
      difficulty,
      targetDate,
      progress: 0,
      status: 'In Progress',
      user_id: req.user._id
    });

    const savedDream = await dream.save();

    // Generate Roadmap
    const roadmapMilestones = await generateRoadmap(title, category, difficulty, 6);
    
    // Create milestones in DB
    const milestonesToSave = roadmapMilestones.map(milestone => {
      return new Milestone({
        dream_id: savedDream._id,
        title: milestone.title,
        month_or_phase: milestone.month,
        order: milestone.order,
        isCompleted: false
      });
    });

    for (const m of milestonesToSave) {
      await m.save();
    }

    // Evaluate badges (e.g. First Dream)
    const newBadges = await checkAndAwardBadges(req.user._id);

    res.status(201).json({
      dream: savedDream,
      newBadges
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get all user dreams
// @route   GET /api/dreams
router.get('/', protect, async (req, res) => {
  try {
    const dreams = await Dream.find({ user_id: req.user._id });
    res.json(dreams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get specific dream & milestones
// @route   GET /api/dreams/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream || dream.user_id !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Dream not found' });
    }

    const milestones = await Milestone.find({ dream_id: dream._id });
    
    // Sort milestones by month_or_phase and order
    milestones.sort((a, b) => {
      if (a.month_or_phase !== b.month_or_phase) {
        return a.month_or_phase.localeCompare(b.month_or_phase);
      }
      return a.order - b.order;
    });

    res.json({ dream, milestones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update dream details
// @route   PUT /api/dreams/:id
router.put('/:id', protect, async (req, res) => {
  const { title, category, priority, difficulty, targetDate, status } = req.body;

  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream || dream.user_id !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Dream not found' });
    }

    const updateData = {
      title: title || dream.title,
      category: category || dream.category,
      priority: priority || dream.priority,
      difficulty: difficulty || dream.difficulty,
      targetDate: targetDate || dream.targetDate,
      status: status || dream.status
    };

    if (status === 'Completed') {
      updateData.progress = 100;
    }

    const updatedDream = await Dream.findByIdAndUpdate(req.params.id, updateData, { new: true });
    
    // Check achievements
    const newBadges = await checkAndAwardBadges(req.user._id);

    res.json({ dream: updatedDream, newBadges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete dream and its milestones
// @route   DELETE /api/dreams/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const dream = await Dream.findById(req.params.id);
    if (!dream || dream.user_id !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Dream not found' });
    }

    await Milestone.deleteMany({ dream_id: dream._id });
    await Dream.deleteOne({ _id: dream._id });

    res.json({ message: 'Dream and associated milestones deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
