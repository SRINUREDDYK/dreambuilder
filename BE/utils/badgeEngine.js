import User from '../models/User.js';
import Dream from '../models/Dream.js';
import Habit from '../models/Habit.js';

export const checkAndAwardBadges = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const currentBadges = new Set(user.badges || []);
    const newlyAwarded = [];

    // 1. Check First Dream
    if (!currentBadges.has('First Dream')) {
      const dreamsCount = await Dream.find({ user_id: userId });
      if (dreamsCount.length >= 1) {
        currentBadges.add('First Dream');
        newlyAwarded.push('First Dream');
      }
    }

    // 2. Check Habit Streaks
    const habits = await Habit.find({ user_id: userId });
    let maxStreak = 0;
    for (const h of habits) {
      if (h.streak > maxStreak) {
        maxStreak = h.streak;
      }
    }

    if (maxStreak >= 7 && !currentBadges.has('7 Day Streak')) {
      currentBadges.add('7 Day Streak');
      newlyAwarded.push('7 Day Streak');
    }
    if (maxStreak >= 30 && !currentBadges.has('30 Day Streak')) {
      currentBadges.add('30 Day Streak');
      newlyAwarded.push('30 Day Streak');
    }

    // 3. Check Dream Progress
    const dreams = await Dream.find({ user_id: userId });
    let hasFifty = false;
    let hasCompleted = false;
    for (const d of dreams) {
      if (d.progress >= 50) {
        hasFifty = true;
      }
      if (d.progress >= 100 || d.status === 'Completed') {
        hasCompleted = true;
      }
    }

    if (hasFifty && !currentBadges.has('50% Completed')) {
      currentBadges.add('50% Completed');
      newlyAwarded.push('50% Completed');
    }
    if (hasCompleted && !currentBadges.has('Dream Achieved')) {
      currentBadges.add('Dream Achieved');
      newlyAwarded.push('Dream Achieved');
    }

    if (newlyAwarded.length > 0) {
      await User.findByIdAndUpdate(userId, { badges: Array.from(currentBadges) });
    }

    return newlyAwarded;
  } catch (error) {
    console.error('Error in badge engine:', error);
    return [];
  }
};
