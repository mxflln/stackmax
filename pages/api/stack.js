import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { profile, isPro } = req.body;

  const systemPrompt = `You are StackMax, an expert supplement advisor. You give science-backed, practical supplement recommendations. You are direct, knowledgeable, and specific. Always give real supplement names, real doses, and honest advice. Never recommend anything unsafe. Format responses as clean JSON only.`;

  const stackSize = isPro ? '10-12' : '3';
  const detailLevel = isPro
    ? 'Include: name, dose, timing, why it works, interactions to watch, Australian source (Chemist Warehouse / iHerb AU / Bulk Nutrients), approximate monthly cost in AUD, priority (must-have/highly recommended/optional), and a category tag.'
    : 'Include: name, dose, timing, why it works, and category tag. Keep it to the 3 most impactful basics only.';

  const prompt = `Build a supplement stack for this person:

Age: ${profile.age || 'not specified'}
Sex: ${profile.sex || 'not specified'}
Goals: ${profile.goals.join(', ')}
Current supplements: ${profile.current || 'none'}
Budget: ${profile.budget || 'not specified'} AUD/month
Health notes: ${profile.health || 'none'}
Diet: ${profile.diet || 'not specified'}

Give me ${stackSize} supplements. ${detailLevel}

${isPro ? 'Also include: a "routine" object with morning/pre-workout/evening/before-bed arrays of supplement names, an "interactions" array of any combinations to be careful with, and a "totalMonthlyCost" estimate in AUD.' : ''}

Return ONLY valid JSON with this structure:
{
  "stack": [
    {
      "name": "...",
      "dose": "...",
      "timing": "...",
      "why": "...",
      "category": "...",
      ${isPro ? '"source": "...", "monthlyCost": "...", "priority": "...", "interaction": "...",' : ''}
      "emoji": "..."
    }
  ]${isPro ? ',\n  "routine": { "morning": [], "preWorkout": [], "evening": [], "beforeBed": [] },\n  "interactions": [],\n  "totalMonthlyCost": "..."' : ''}
}`;

  try {
    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: isPro ? 2000 : 800,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }]
    });

    const text = message.content[0].text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON found');
    const data = JSON.parse(jsonMatch[0]);

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
