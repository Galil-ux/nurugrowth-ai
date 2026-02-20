export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { platform, theme, tone, additionalContext } = req.body;
  const apiKey = process.env.LFM_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const systemPrompt = `You are a Kingdom-aligned social media content creator for NuruGrowth, a marketing agency specializing in solar/clean energy in Kenya. You create warm, relatable, authentic posts for moms and families interested in clean energy, sustainability, and purpose-driven living.

Guidelines:
- Be warm, encouraging, and relatable to moms
- Focus on practical benefits and family values
- Include faith/Kingdom perspective where appropriate
- Keep tone authentic and human, not promotional
- Use inclusive language for diverse Kenyan families
- Inspire action without being pushy`;

    const userPrompt = `Create a ${platform} post about "${theme}".
Tone: ${tone}
${additionalContext ? `Additional context: ${additionalContext}` : ''}

Post requirements:
- Platform: ${platform} (adjust length and format accordingly)
- Keep it engaging and authentic
- Include 1-2 relevant hashtags at end
- No generic AI language`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.8,
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter error: ${error}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content.trim();

    res.status(200).json({
      text: generatedText,
      platform,
      theme,
      tone
    });
  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ error: 'Failed to generate post' });
  }
}
