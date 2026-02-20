/*
  # Create posts table for AI-generated content

  1. New Tables
    - `posts`
      - `id` (uuid, primary key)
      - `content` (text) - The generated post text
      - `platform` (text) - Social media platform (instagram, facebook, twitter, etc.)
      - `tone` (text) - The tone used for generation
      - `theme` (text) - Content theme/topic
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `posts` table
    - Add policy for public read access (demo mode)
    - Add policy for anyone to create posts
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  platform text DEFAULT 'instagram',
  tone text DEFAULT 'warm and relatable',
  theme text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view posts"
  ON posts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create posts"
  ON posts
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
