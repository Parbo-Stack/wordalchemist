/*
  # Create high scores table with RLS policies

  1. New Tables
    - `high_scores`
      - `id` (uuid, primary key)
      - `player_name` (text)
      - `score` (integer)
      - `game_mode` (text)
      - `created_at` (timestamptz)
  
  2. Security
    - Enable RLS on `high_scores` table
    - Add policies for public read and insert access
*/

-- Create the high_scores table if it doesn't exist
CREATE TABLE IF NOT EXISTS high_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  game_mode text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'high_scores' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Drop existing policies to avoid conflicts
  DROP POLICY IF EXISTS "Anyone can read high scores" ON high_scores;
  DROP POLICY IF EXISTS "Anyone can insert scores" ON high_scores;
  
  -- Create new policies
  CREATE POLICY "Anyone can read high scores"
    ON high_scores
    FOR SELECT
    TO public
    USING (true);

  CREATE POLICY "Anyone can insert scores"
    ON high_scores
    FOR INSERT
    TO public
    WITH CHECK (true);
END $$;