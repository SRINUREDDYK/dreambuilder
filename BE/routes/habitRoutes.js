import express from 'express';
import Habit from '../models/Habit.js';
import { protect } from '../middleware/auth.js';
import { checkAndAwardBadges } from '../utils/badgeEngine.js';

const router = express.Router();

// @desc    Get all user habits
// @route   GET /api/habits
router.get('/', protect, async (req, res) => {
  try {
    const habits = await Habit.find({ user_id: req.user._id });
    res.json(habits);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Create a new habit
// @route   POST /api/habits
router.post('/', protect, async (req, res) => {
  const { title, frequency } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: 'Habit title is required' });
    }

    const habit = new Habit({
      user_id: req.user._id,
      title,
      frequency: frequency || 'Daily',
      streak: 0,
      lastCompletedDate: '',
      history: []
    });

    const savedHabit = await habit.save();
    res.status(201).json(savedHabit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Toggle habit check-in for today & calculate streak
// @route   PUT /api/habits/:id/checkin
router.put('/:id/checkin', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user_id !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    // Set today's date in local time zone format YYYY-MM-DD
    const tzOffset = (new Date()).getTimezoneOffset() * 60000; // offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzOffset)).toISOString().slice(0, 10);
    const todayStr = localISOTime;
    
    // Yesterday
    const yesterdayStr = (new Date(Date.now() - tzOffset - 86400000)).toISOString().slice(0, 10);

    let updatedHistory = [...(habit.history || [])];
    let streak = habit.streak || 0;
    let lastCompletedDate = habit.lastCompletedDate || '';

    const alreadyCompleted = updatedHistory.includes(todayStr);

    if (!alreadyCompleted) {
      // Check in
      updatedHistory.push(todayStr);
      if (lastCompletedDate === yesterdayStr) {
        streak += 1;
      } else if (lastCompletedDate === todayStr) {
        // already done (edge case)
      } else {
        // streak broken or first time
        streak = 1;
      }
      lastCompletedDate = todayStr;
    } else {
      // Undo check in
      updatedHistory = updatedHistory.filter(d => d !== todayStr);
      
      const sortedHistory = [...updatedHistory].sort();
      if (sortedHistory.length > 0) {
        const prev = sortedHistory[sortedHistory.length - 1];
        lastCompletedDate = prev;
        
        // Recalculate streak backwards from previous completion date
        let tempStreak = 0;
        let checkDate = new Date(prev);
        while (true) {
          const checkStr = new Date(checkDate.getTime() - tzOffset).toISOString().slice(0, 10);
          if (updatedHistory.includes(checkStr)) {
            tempStreak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
        streak = tempStreak;
      } else {
        lastCompletedDate = '';
        streak = 0;
      }
    }

    const updatedHabit = await Habit.findByIdAndUpdate(
      req.params.id,
      {
        history: updatedHistory,
        streak,
        lastCompletedDate
      },
      { new: true }
    );

    // Evaluate streaks for badges
    const newBadges = await checkAndAwardBadges(req.user._id);

    res.json({ habit: updatedHabit, newBadges });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Delete a habit
// @route   DELETE /api/habits/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const habit = await Habit.findById(req.params.id);
    if (!habit || habit.user_id !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Habit not found' });
    }

    await Habit.deleteOne({ _id: habit._id });
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
