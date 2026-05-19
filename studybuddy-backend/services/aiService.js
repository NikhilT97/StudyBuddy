const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ── Generate Learning Path ────────────────────────────
const generateLearningPath = async (topic, level = "beginner") => {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content:
          "You are an expert learning path designer. You always respond with valid JSON only. No markdown, no backticks, no extra text.",
      },
      {
        role: "user",
        content: `Create a structured learning path for: "${topic}"
Student level: ${level}

Return ONLY a valid JSON array in this exact format:
[
  {
    "order": 1,
    "title": "Module title",
    "description": "What this module covers in 2 lines",
    "estimatedDays": 3,
    "topics": ["topic1", "topic2", "topic3"]
  }
]

Rules:
- Return 5 to 7 modules
- Keep it practical and beginner-friendly if level is beginner
- Only return the JSON array, nothing else`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1024,
  });

  const rawText = completion.choices[0].message.content.trim();

  // Clean markdown fences just in case
  const cleaned = rawText
    .replace(/^```json/, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  return parsed;
};

// ── AI Tutor Chat ─────────────────────────────────────
const chatWithTutor = async (topic, messages) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are an expert AI tutor helping a student learn "${topic}". 
Keep your explanations simple, practical, and beginner-friendly.
Use real world examples wherever possible.
Keep responses concise and to the point.`,
      },
      ...messages, // full conversation history
    ],
    temperature: 0.7,
    max_tokens: 1024,
  })

  return completion.choices[0].message.content.trim()
}


// ── Generate Quiz ─────────────────────────────────────
const generateQuiz = async (topic) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a quiz generator. You always respond with valid JSON only. No markdown, no backticks, no extra text.',
      },
      {
        role: 'user',
        content: `Generate a quiz with 5 multiple choice questions for the topic: "${topic}"

Return ONLY a valid JSON array in this exact format:
[
  {
    "question": "What is...?",
    "options": [
      { "label": "A", "text": "First option" },
      { "label": "B", "text": "Second option" },
      { "label": "C", "text": "Third option" },
      { "label": "D", "text": "Fourth option" }
    ],
    "correctAnswer": "A",
    "explanation": "Because..."
  }
]

Rules:
- Return exactly 5 questions
- Make questions practical and beginner friendly
- Only return the JSON array, nothing else`,
      },
    ],
    temperature: 0.7,
    max_tokens: 2048,
  })

  const rawText = completion.choices[0].message.content.trim()

  const cleaned = rawText
    .replace(/^```json/, '')
    .replace(/^```/, '')
    .replace(/```$/, '')
    .trim()

  return JSON.parse(cleaned)
}


module.exports = { generateLearningPath, chatWithTutor, generateQuiz };
