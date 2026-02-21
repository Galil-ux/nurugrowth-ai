# NuruGrowth AI Poster Studio

AI-powered social media content generator for Kingdom-aligned mom-focused posts about clean energy and sustainability.

## Features

- 🤖 AI-powered content generation using OpenRouter API
- 📱 Multi-platform support (Instagram, Facebook, TikTok, Twitter, LinkedIn)
- 🎨 Customizable tone and themes
- 💾 Post history with Supabase database
- 📋 Copy to clipboard functionality
- 🌱 Kingdom-aligned content for NuruGrowth brand

## Setup

1. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Add your OpenRouter API key to `OPENROUTER_API_KEY`
   - Supabase credentials are pre-configured

2. **Database Setup**
   - The posts table is already created via migration
   - No additional database setup required

3. **API Key Setup**
   - Get an API key from [OpenRouter](https://openrouter.ai/)
   - Add it to your `.env` file

## Development

```bash
npm install
npm run dev
```

## Deployment

The app uses Supabase Edge Functions for the AI generation endpoint. Make sure to:

1. Set the `OPENROUTER_API_KEY` environment variable in your Supabase project
2. Deploy the edge function to Supabase

## Usage

1. Select your target platform
2. Choose a theme relevant to clean energy/sustainability
3. Pick an appropriate tone
4. Add any additional context
5. Click "Generate Post" to create AI-powered content
6. Copy the generated post to your clipboard
7. View your post history in the sidebar

## Brand Guidelines

Content is optimized for:
- Kingdom-aligned messaging
- Mom-focused audience
- Clean energy/solar topics
- Kenyan market context
- Authentic, non-promotional tone