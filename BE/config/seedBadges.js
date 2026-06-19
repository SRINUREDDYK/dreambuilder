import Badge from '../models/Badge.js';

const defaultBadges = [
  {
    title: 'First Dream',
    description: 'Began your journey by creating your first dream!',
    icon: '🏅',
    requirementType: 'dream_created',
    requirementValue: 1
  },
  {
    title: '7 Day Streak',
    description: 'Kept the fire burning for 7 consecutive days!',
    icon: '🔥',
    requirementType: 'habit_streak',
    requirementValue: 7
  },
  {
    title: '30 Day Streak',
    description: 'Demonstrated incredible consistency for 30 days!',
    icon: '⚡',
    requirementType: 'habit_streak',
    requirementValue: 30
  },
  {
    title: '50% Completed',
    description: 'Crossed the halfway point of a dream roadmap!',
    icon: '📈',
    requirementType: 'progress_milestone',
    requirementValue: 50
  },
  {
    title: 'Dream Achieved',
    description: 'Reached 100% progress and completed your dream!',
    icon: '🏆',
    requirementType: 'dream_completed',
    requirementValue: 100
  }
];

export const seedBadges = async () => {
  try {
    const count = await Badge.find({});
    if (count.length === 0) {
      for (const badge of defaultBadges) {
        await Badge.create(badge);
      }
      console.log('🏅 Default badges seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding badges:', error);
  }
};
