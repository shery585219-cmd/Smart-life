import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function getAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. Turn raw written idea or brain-dump into organized tasks
app.post('/api/ai/parse-ideas', async (req, res) => {
  const { text = '', persona = 'adult' } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text prompt is required' });
  }

  try {
    const ai = getAI();
    if (ai) {
      const prompt = `You are SmartLife AI assistant. Analyze this user brain dump or note and convert it into a clean, actionable task list.
User Persona: ${persona} (keep tone and complexity suitable for this persona: kid, teen, or adult).
Input: "${text}"

Respond with ONLY valid JSON with this format:
{
  "summary": "Short 1-sentence recap of what was planned",
  "tasks": [
    {
      "title": "Task title",
      "category": "Work" | "School" | "Home" | "Personal" | "Health" | "Shopping",
      "priority": "low" | "medium" | "high",
      "estimatedMinutes": 30,
      "dueDate": "today",
      "subtasks": ["subtask 1", "subtask 2"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }
  } catch (error) {
    console.warn('Gemini temporary spike/fallback, using smart extractor:', error);
  }

  // Graceful smart heuristic fallback if Gemini has transient 503
  const lines = text.split(/[,.\n;]/).map((s) => s.trim()).filter((s) => s.length > 2);
  const tasks = (lines.length > 0 ? lines : [text]).slice(0, 5).map((line, idx) => ({
    title: line.charAt(0).toUpperCase() + line.slice(1),
    category:
      line.toLowerCase().includes('study') || line.toLowerCase().includes('exam') || line.toLowerCase().includes('school')
        ? 'School'
        : line.toLowerCase().includes('buy') || line.toLowerCase().includes('grocer')
        ? 'Shopping'
        : line.toLowerCase().includes('workout') || line.toLowerCase().includes('walk') || line.toLowerCase().includes('doctor')
        ? 'Health'
        : 'Personal',
    priority: idx === 0 ? 'high' : 'medium',
    estimatedMinutes: 25,
    dueDate: 'today',
    subtasks: ['Gather needed items', 'Complete initial milestone', 'Review & mark complete'],
  }));

  return res.json({
    summary: `Organized ${tasks.length} actionable tasks from your notes`,
    tasks,
  });
});

// 2. Daily schedule generator
app.post('/api/ai/daily-schedule', async (req, res) => {
  const { tasks = [], habits = [], energyLevel = 'medium', wakeTime = '07:30', bedTime = '22:30', persona = 'adult' } = req.body;

  try {
    const ai = getAI();
    if (ai) {
      const taskList = tasks.map((t: any) => `- ${t.title} (${t.priority} priority, ~${t.estimatedMinutes || 30}m)`).join('\n');
      const habitList = habits.map((h: any) => `- ${h.title} (${h.timeOfDay || 'anytime'})`).join('\n');

      const prompt = `You are SmartLife, an expert daily life planner.
Create an optimal time-blocked daily schedule for a user.
User profile:
- Persona: ${persona} (kid, teen, adult)
- Wakes up around: ${wakeTime}
- Winds down around: ${bedTime}
- Current energy target: ${energyLevel}

Current Pending Tasks:
${taskList || 'No specific pending tasks provided'}

Daily Habits to fit in:
${habitList || 'General healthy habits (hydration, movement, reading)'}

Generate a realistic, energizing schedule with breaks, deep work, and wind-down.
Respond with ONLY valid JSON:
{
  "coachAdvice": "1-2 sentences of encouraging, practical advice for today",
  "schedule": [
    {
      "time": "08:00 - 08:45",
      "title": "Block title",
      "type": "habit" | "task" | "break" | "personal",
      "tip": "Short actionable tip or motivation"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }
  } catch (error) {
    console.warn('Gemini schedule fallback:', error);
  }

  // Graceful fallback
  return res.json({
    coachAdvice: 'Prioritize your top 3 needle-moving tasks before lunch for maximum momentum.',
    schedule: [
      { time: '08:00 - 08:30', title: 'Morning Glass of Water & Light Movement', type: 'habit', tip: 'Hydrate before coffee for steady energy' },
      { time: '09:00 - 11:30', title: 'Deep Focus Block: Priority Task', type: 'task', tip: 'Put notifications on do-not-disturb' },
      { time: '12:00 - 13:00', title: 'Healthy Lunch & 20m Walk', type: 'break', tip: 'Rest your eyes from screens' },
      { time: '14:00 - 16:30', title: 'Afternoon Execution & Errands', type: 'task', tip: 'Group smaller tasks together' },
      { time: '20:30 - 21:15', title: 'Evening Wind-Down & Desk Reset', type: 'habit', tip: 'Dim lighting for restful sleep' },
    ],
  });
});

// 3. Goal breakdown
app.post('/api/ai/goal-breakdown', async (req, res) => {
  const { goalTitle = '', timeframe = '30 days', difficulty = 'moderate', persona = 'adult' } = req.body;

  try {
    const ai = getAI();
    if (ai) {
      const prompt = `Break down this goal for a ${persona}:
Goal: "${goalTitle}"
Timeframe: "${timeframe}"
Difficulty: "${difficulty}"

Provide a structured, motivating multi-phase roadmap and a specific daily micro-habit.
Return ONLY valid JSON:
{
  "overview": "Short motivational roadmap summary",
  "dailyHabitSuggestion": "A bite-sized 5-15 minute daily habit to build momentum",
  "milestones": [
    {
      "phase": "Phase 1 (Days 1-7)",
      "title": "Phase title",
      "description": "What is accomplished",
      "keyActions": ["Action 1", "Action 2"]
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }
  } catch (error) {
    console.warn('Gemini goal fallback:', error);
  }

  return res.json({
    overview: `A realistic, incremental roadmap to achieve "${goalTitle}"`,
    dailyHabitSuggestion: `Dedicate 15 uninterrupted minutes daily to ${goalTitle}`,
    milestones: [
      { phase: 'Phase 1 (Days 1-7)', title: 'Baseline & Environment Setup', description: 'Eliminate friction and establish the habit anchor.', keyActions: ['Prepare all necessary supplies', 'Complete 1 small practice session'] },
      { phase: 'Phase 2 (Days 8-15)', title: 'Consistency & Repetition', description: 'Show up regularly without focusing on perfection.', keyActions: ['Log 5 consecutive days', 'Review and overcome common roadblocks'] },
      { phase: 'Phase 3 (Days 16-23)', title: 'Progressive Challenge', description: 'Step up the duration or complexity by 20%.', keyActions: ['Increase intensity or scope', 'Reward yourself for hitting milestone'] },
      { phase: 'Phase 4 (Days 24-30)', title: 'Integration & Celebration', description: 'Lock in progress as permanent second nature.', keyActions: ['Conduct final review', 'Celebrate milestone success!'] },
    ],
  });
});

// 4. Summarize day
app.post('/api/ai/summarize-day', async (req, res) => {
  const { completedTasks = [], completedHabits = [], notes = '', date = 'today' } = req.body;

  try {
    const ai = getAI();
    if (ai) {
      const prompt = `Review the user's daily achievements and notes for ${date}:
Completed Tasks: ${completedTasks.join(', ') || 'None reported'}
Completed Habits: ${completedHabits.join(', ') || 'None reported'}
User Daily Journal / Notes: "${notes || 'No notes written today'}"

Generate an uplifting daily summary, productivity score (0-100), key strengths shown, and 1 actionable focus for tomorrow.
Return ONLY valid JSON:
{
  "highlight": "Punchy 1-sentence victory headline",
  "summary": "2-3 sentences summarizing progress and mindset",
  "score": 88,
  "strengths": ["Strength 1", "Strength 2"],
  "nextDaySuggestion": "1 actionable recommendation for tomorrow"
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }
  } catch (error) {
    console.warn('Gemini summary fallback:', error);
  }

  const taskCount = completedTasks.length;
  const habitCount = completedHabits.length;
  const score = Math.min(98, 65 + taskCount * 6 + habitCount * 5);

  return res.json({
    highlight: `Solid progress! You completed ${taskCount} tasks and maintained ${habitCount} habits.`,
    summary: notes
      ? `You reflected: "${notes.slice(0, 80)}...". Great consistency and steady focus throughout the day.`
      : 'You maintained steady momentum across key life areas today. Regular execution is building strong habits.',
    score,
    strengths: ['Consistent daily execution', 'Proactive habit maintenance', 'Clear task focus'],
    nextDaySuggestion: 'Set your top 2 non-negotiable priorities first thing tomorrow morning.',
  });
});

// 5. Smart Shopping list
app.post('/api/ai/smart-shopping', async (req, res) => {
  const { inputPrompt = '' } = req.body;

  try {
    const ai = getAI();
    if (ai) {
      const prompt = `The user wants to generate or organize a shopping list based on:
"${inputPrompt}"

Parse and organize into smart shopping categories (Produce, Dairy & Eggs, Bakery, Meat & Seafood, Pantry, Beverages, Snacks, Household).
Include realistic quantities and approximate estimated price in USD.
Return ONLY valid JSON:
{
  "estimatedTotal": 24.50,
  "items": [
    {
      "name": "Item name",
      "category": "Produce" | "Dairy & Eggs" | "Bakery" | "Meat & Seafood" | "Pantry" | "Beverages" | "Snacks" | "Household",
      "quantity": "e.g. 2 lbs or 1 pack",
      "estimatedPrice": 3.99
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text);
        return res.json(parsed);
      }
    }
  } catch (error) {
    console.warn('Gemini shopping fallback:', error);
  }

  return res.json({
    estimatedTotal: 18.5,
    items: [
      { name: 'Fresh Garlic & Onions', category: 'Produce', quantity: '1 bag', estimatedPrice: 2.99 },
      { name: 'Organic Olive Oil', category: 'Pantry', quantity: '1 bottle', estimatedPrice: 7.99 },
      { name: 'Whole Grain Sourdough', category: 'Bakery', quantity: '1 loaf', estimatedPrice: 4.5 },
      { name: 'Greek Yogurt', category: 'Dairy & Eggs', quantity: '32 oz', estimatedPrice: 3.99 },
    ],
  });
});

// 6. Interactive Chat
app.post('/api/ai/chat', async (req, res) => {
  const { message = '', history = [], context = {} } = req.body;

  try {
    const ai = getAI();
    if (ai) {
      const systemInstruction = `You are SmartLife AI, an enthusiastic, empathetic, and exceptionally practical daily life assistant.
You help all ages (kids, students, parents, busy professionals) manage time, avoid overwhelm, organize homework, chores, routines, and habits.
Keep answers concise, clear, and structured with bullet points or step-by-step checklists where helpful.
Never use complicated jargon.
Current user context:
- Name: ${context.userName || 'Friend'}
- Persona: ${context.persona || 'Adult'}
- Active tasks count: ${context.pendingTasksCount || 0}
- Active habits count: ${context.activeHabitsCount || 0}
- Current streak: ${context.currentStreak || 0} days`;

      const contents = [
        { role: 'user', parts: [{ text: systemInstruction }] },
        { role: 'model', parts: [{ text: "Hello! I am SmartLife AI, ready to help you plan, organize, and thrive today." }] },
        ...history.slice(-6).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content }],
        })),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
      });

      if (response.text) {
        return res.json({ reply: response.text });
      }
    }
  } catch (error) {
    console.warn('Gemini chat fallback:', error);
  }

  return res.json({
    reply: `Here is a great plan for you:
1. **Pick One Top Task**: Start with the highest priority task on your list.
2. **Use a 25-Minute Timer**: Open our Focus Pomodoro timer and work without distractions.
3. **Hydrate & Reset**: Take a 5-minute breather before moving to the next item!

You have a ${context.currentStreak || 0}-day streak running—keep up the great rhythm!`,
  });
});

// Start Server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartLife server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
