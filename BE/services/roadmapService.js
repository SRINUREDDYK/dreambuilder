// Roadmap generator service supporting both standard high-fidelity heuristics and Gemini API

const PREDEFINED_ROADMAPS = {
  webdev: [
    { month: 'Month 1', title: 'Learn HTML & CSS Basics', order: 1 },
    { month: 'Month 1', title: 'Build 3 responsive landing pages', order: 2 },
    { month: 'Month 2', title: 'Master JavaScript Fundamentals', order: 3 },
    { month: 'Month 2', title: 'Understand DOM Manipulation & Fetch API', order: 4 },
    { month: 'Month 3', title: 'Learn React.js Basics (Components, Props, State)', order: 5 },
    { month: 'Month 3', title: 'Build a fully interactive React application', order: 6 },
    { month: 'Month 4', title: 'Learn Backend Development with Node.js & Express', order: 7 },
    { month: 'Month 4', title: 'Build and test RESTful APIs', order: 8 },
    { month: 'Month 5', title: 'Database management (MongoDB / SQL)', order: 9 },
    { month: 'Month 5', title: 'Integrate Frontend and Backend with Auth', order: 10 },
    { month: 'Month 6', title: 'Deploy to Cloud (Vercel/Render/Heroku)', order: 11 },
    { month: 'Month 6', title: 'Build and deploy a Capstone Portfolio project', order: 12 }
  ],
  fitness: [
    { month: 'Month 1', title: 'Establish baseline fitness & nutrition tracking', order: 1 },
    { month: 'Month 1', title: 'Start basic strength training (3x/week)', order: 2 },
    { month: 'Month 2', title: 'Increase stamina with cardio & conditioning', order: 3 },
    { month: 'Month 2', title: 'Adjust caloric & protein intake goals', order: 4 },
    { month: 'Month 3', title: 'Optimize workout split (Push/Pull/Legs)', order: 5 },
    { month: 'Month 3', title: 'Track improvements in strength/endurance metrics', order: 6 },
    { month: 'Month 4', title: 'Introduce HIIT and advanced core exercises', order: 7 },
    { month: 'Month 5', title: 'Establish peak cardiovascular performance benchmarks', order: 8 },
    { month: 'Month 6', title: 'Solidify lifestyle habits & transition to maintenance', order: 9 }
  ],
  business: [
    { month: 'Month 1', title: 'Conduct market research & target audience analysis', order: 1 },
    { month: 'Month 1', title: 'Draft a solid 1-page Business Model Canvas', order: 2 },
    { month: 'Month 2', title: 'Design branding, logo, and landing page', order: 3 },
    { month: 'Month 2', title: 'Develop MVP (Minimum Viable Product)', order: 4 },
    { month: 'Month 3', title: 'Gather beta user feedback and iterate on product', order: 5 },
    { month: 'Month 4', title: 'Launch marketing/social media campaigns', order: 6 },
    { month: 'Month 5', title: 'Set up accounting, legal structure, and billing', order: 7 },
    { month: 'Month 6', title: 'Official public launch & initial scaling strategies', order: 8 }
  ],
  finance: [
    { month: 'Month 1', title: 'Audit monthly expenses and categorize spending', order: 1 },
    { month: 'Month 1', title: 'Create a zero-based monthly budget', order: 2 },
    { month: 'Month 2', title: 'Build a starter $1,000 emergency fund', order: 3 },
    { month: 'Month 3', title: 'Pay off highest interest debts (Debt Avalanche/Snowball)', order: 4 },
    { month: 'Month 4', title: 'Extend emergency fund to 3-6 months of expenses', order: 5 },
    { month: 'Month 5', title: 'Learn basics of index funds and retirement accounts', order: 6 },
    { month: 'Month 6', title: 'Automate savings and investment contributions', order: 7 }
  ],
  education: [
    { month: 'Month 1', title: 'Define study goals & gather best resource materials', order: 1 },
    { month: 'Month 1', title: 'Establish a daily study schedule (1-2 hours)', order: 2 },
    { month: 'Month 2', title: 'Master core fundamental theories/concepts', order: 3 },
    { month: 'Month 3', title: 'Create summary notes, flashcards & self-quizzes', order: 4 },
    { month: 'Month 4', title: 'Apply knowledge in practice test settings', order: 5 },
    { month: 'Month 5', title: 'Deep dive into complex topics and patch knowledge gaps', order: 6 },
    { month: 'Month 6', title: 'Take comprehensive assessments & final review', order: 7 }
  ],
  travel: [
    { month: 'Month 1', title: 'Research destinations, flights, and weather trends', order: 1 },
    { month: 'Month 2', title: 'Create a detailed travel itinerary and budget estimate', order: 2 },
    { month: 'Month 3', title: 'Set up a dedicated travel savings account', order: 3 },
    { month: 'Month 4', title: 'Book flights and secure accommodation arrangements', order: 4 },
    { month: 'Month 5', title: 'Apply for visas, check passport validity & vaccinations', order: 5 },
    { month: 'Month 6', title: 'Finalize packing list, purchase insurance & pack bags', order: 6 }
  ]
};

export const generateRoadmap = async (dreamTitle, category, difficulty, durationInMonths = 6) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey) {
    try {
      console.log('Generating roadmap with Gemini API...');
      const prompt = `You are an AI goal planner. For the dream: "${dreamTitle}", which is in the category "${category}", difficulty level "${difficulty}", generate a comprehensive month-by-month roadmap spanning ${durationInMonths} months. Format the output STRICTLY as a JSON array of milestones where each milestone object has:
      {
        "month": "Month X",
        "title": "A short, actionable, specific task or goal",
        "order": number
      }
      Provide ONLY the raw JSON array. Do not include markdown code block styling or any other text.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (data.candidates && data.candidates[0].content.parts[0].text) {
        let text = data.candidates[0].content.parts[0].text.trim();
        // Remove code blocks if present
        if (text.startsWith('```json')) {
          text = text.substring(7, text.length - 3).trim();
        } else if (text.startsWith('```')) {
          text = text.substring(3, text.length - 3).trim();
        }
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error('Gemini API call failed, falling back to local generator:', error);
    }
  }

  // Fallback to local rule-based database
  console.log('Generating roadmap with local rule-based generator...');
  const titleLower = dreamTitle.toLowerCase();
  let selectedTemplate = null;

  if (titleLower.includes('web') || titleLower.includes('developer') || titleLower.includes('code') || titleLower.includes('software') || titleLower.includes('programming') || titleLower.includes('full stack')) {
    selectedTemplate = PREDEFINED_ROADMAPS.webdev;
  } else if (category === 'Fitness' || titleLower.includes('workout') || titleLower.includes('gym') || titleLower.includes('fitness') || titleLower.includes('weight') || titleLower.includes('health') || titleLower.includes('run')) {
    selectedTemplate = PREDEFINED_ROADMAPS.fitness;
  } else if (category === 'Business' || titleLower.includes('startup') || titleLower.includes('business') || titleLower.includes('sales') || titleLower.includes('company')) {
    selectedTemplate = PREDEFINED_ROADMAPS.business;
  } else if (category === 'Finance' || titleLower.includes('save') || titleLower.includes('money') || titleLower.includes('invest') || titleLower.includes('budget') || titleLower.includes('stock')) {
    selectedTemplate = PREDEFINED_ROADMAPS.finance;
  } else if (category === 'Travel' || titleLower.includes('travel') || titleLower.includes('trip') || titleLower.includes('visit')) {
    selectedTemplate = PREDEFINED_ROADMAPS.travel;
  } else if (category === 'Education' || titleLower.includes('learn') || titleLower.includes('study') || titleLower.includes('course') || titleLower.includes('exam')) {
    selectedTemplate = PREDEFINED_ROADMAPS.education;
  }

  if (selectedTemplate) {
    // Return template customized or scaled to months
    return selectedTemplate.map(m => ({ ...m }));
  }

  // Generic Dynamic fallback customized with the dream title
  const genericRoadmap = [];
  const phases = [
    { name: 'Month 1', action: 'Research and define prerequisites for' },
    { name: 'Month 2', action: 'Begin basic practice and learn foundational tools for' },
    { name: 'Month 3', action: 'Build your first simple hands-on projects related to' },
    { name: 'Month 4', action: 'Expand to intermediate topics and solve complex problems in' },
    { name: 'Month 5', action: 'Review and optimize your skills, and finalize projects for' },
    { name: 'Month 6', action: 'Deploy, launch, or achieve final parameters of' }
  ];

  let order = 1;
  for (let i = 0; i < Math.min(durationInMonths, 6); i++) {
    const phase = phases[i] || { name: `Month ${i + 1}`, action: 'Advance further steps of' };
    genericRoadmap.push({
      month: phase.name,
      title: `${phase.action} "${dreamTitle}"`,
      order: order++
    });
    genericRoadmap.push({
      month: phase.name,
      title: `Complete evaluation and set target checklist for next phase`,
      order: order++
    });
  }

  return genericRoadmap;
};
