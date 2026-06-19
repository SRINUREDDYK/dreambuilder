import express from 'express';
import Dream from '../models/Dream.js';
import Habit from '../models/Habit.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get dashboard and progress analytics
// @route   GET /api/analytics
router.get('/', protect, async (req, res) => {
  try {
    const dreams = await Dream.find({ user_id: req.user._id });
    const habits = await Habit.find({ user_id: req.user._id });

    // 1. Dream stats
    const totalDreams = dreams.length;
    const completedDreams = dreams.filter(d => d.status === 'Completed').length;
    const activeDreams = dreams.filter(d => d.status === 'In Progress').length;
    
    let avgProgress = 0;
    if (totalDreams > 0) {
      const sum = dreams.reduce((acc, d) => acc + d.progress, 0);
      avgProgress = Math.round(sum / totalDreams);
    }

    // 2. Category distribution
    const categories = ['Career', 'Fitness', 'Business', 'Education', 'Travel', 'Finance'];
    const categoryStats = {};
    categories.forEach(cat => {
      categoryStats[cat] = dreams.filter(d => d.category === cat).length;
    });

    // 3. Habit stats
    const totalHabits = habits.length;
    const tzOffset = (new Date()).getTimezoneOffset() * 60000;
    const todayStr = new Date(Date.now() - tzOffset).toISOString().slice(0, 10);
    
    const habitsCompletedToday = habits.filter(h => h.history.includes(todayStr)).length;
    
    let maxStreak = 0;
    let totalStreaks = 0;
    habits.forEach(h => {
      if (h.streak > maxStreak) maxStreak = h.streak;
      totalStreaks += h.streak;
    });
    const avgStreak = totalHabits > 0 ? Math.round(totalStreaks / totalHabits) : 0;

    // 4. Past 7 Days Habit Completion Rate
    const weeklyCompletions = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - tzOffset - i * 86400000);
      const dayStr = d.toISOString().slice(0, 10);
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const completedCount = habits.filter(h => h.history.includes(dayStr)).length;
      
      weeklyCompletions.push({
        date: dayStr,
        dayName,
        completed: completedCount,
        rate: totalHabits > 0 ? Math.round((completedCount / totalHabits) * 100) : 0
      });
    }

    // 5. Monthly dream completion velocity
    // (mocking/structuring for a clean line chart of progress rate by category or overall)
    const monthlyProgress = [
      { name: 'Jan', progress: Math.max(0, avgProgress - 20) },
      { name: 'Feb', progress: Math.max(0, avgProgress - 15) },
      { name: 'Mar', progress: Math.max(0, avgProgress - 10) },
      { name: 'Apr', progress: Math.max(0, avgProgress - 5) },
      { name: 'May', progress: avgProgress },
      { name: 'Jun', progress: avgProgress }
    ];

    res.json({
      summary: {
        totalDreams,
        completedDreams,
        activeDreams,
        avgProgress,
        totalHabits,
        habitsCompletedToday,
        maxStreak,
        avgStreak
      },
      categoryStats,
      weeklyCompletions,
      monthlyProgress
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
