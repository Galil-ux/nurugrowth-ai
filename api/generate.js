import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { brand, industry, values, tone } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'user',
        content: `Write a short Facebook promotional post (under 280 characters) for "${brand}" in the "${industry}" industry. Core values: "${values}". Tone: ${tone}. Make it engaging, human, and aligned with Kingdom-minded excellence. No hashtags.`
      }],
      max_tokens: 150
    });

    res.status(200).json({
      text: completion.choices[0].message.content.trim()
    });
  } catch (error) {
    res.status(500).json({ error: 'AI generation failed' });
  }
}
