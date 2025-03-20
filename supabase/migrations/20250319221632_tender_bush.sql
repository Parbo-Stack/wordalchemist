/*
  # Update high scores table and policies

  1. Table Structure
    - Ensures high_scores table exists with correct structure
    - Maintains existing table if already present
  
  2. Security
    - Ensures RLS is enabled
    - Safely handles existing policies
    - Recreates policies if needed
*/

-- Create the high_scores table if it doesn't exist
CREATE TABLE IF NOT EXISTS high_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  game_mode text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS safely
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

-- Handle policies safely
DO $$ 
BEGIN
  -- Drop existing policies first to avoid conflicts
  DROP POLICY IF EXISTS "Anyone can read high scores" ON high_scores;
  DROP POLICY IF EXISTS "Anyone can insert scores" ON high_scores;
  
  -- Create fresh policies
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