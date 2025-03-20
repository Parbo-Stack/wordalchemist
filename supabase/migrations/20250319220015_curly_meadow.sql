/*
  # Create high scores table and policies

  1. New Tables
    - `high_scores`
      - `id` (uuid, primary key)
      - `player_name` (text)
      - `score` (integer)
      - `game_mode` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `high_scores` table
    - Add policy for public read access
    - Add policy for public insert access
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
  ALTER TABLE high_scores ENABLE ROW LEVEL SECURITY;
EXCEPTION
  WHEN others THEN NULL;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Check and create read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'high_scores' 
    AND policyname = 'Anyone can read high scores'
  ) THEN
    CREATE POLICY "Anyone can read high scores"
      ON high_scores
      FOR SELECT
      TO public
      USING (true);
  END IF;

  -- Check and create insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'high_scores' 
    AND policyname = 'Anyone can insert scores'
  ) THEN
    CREATE POLICY "Anyone can insert scores"
      ON high_scores
      FOR INSERT
      TO public
      WITH CHECK (true);
  END IF;
END $$;