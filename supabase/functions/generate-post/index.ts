/*
  # Generate Post Edge Function

  1. Purpose
    - Generate AI-powered social media content using OpenRouter API
    - Handle content generation requests from the frontend
    - Store generated posts in the database

  2. Security
    - Uses environment variables for API keys
    - Validates request parameters
    - Handles CORS properly

  3. Features
    - Supports multiple platforms (Instagram, Facebook, TikTok, etc.)
    - Customizable tone and theme
    - Kingdom-aligned content for NuruGrowth brand
*/

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface GenerateRequest {
  platform: string;
  theme: string;
  tone: string;
  additionalContext?: string;
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const { platform, theme, tone, additionalContext }: GenerateRequest = await req.json();

    if (!platform || !theme || !tone) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

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

    return new Response(
      JSON.stringify({
        text: generatedText,
        platform,
        theme,
        tone
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error('Generation error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate post' }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});