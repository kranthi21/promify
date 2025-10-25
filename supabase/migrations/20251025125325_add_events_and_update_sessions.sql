/*
  # Add Events and Update Sessions Schema

  1. New Tables
    - `events`
      - `id` (uuid, primary key) - Unique event identifier
      - `user_id` (uuid) - Reference to auth.users
      - `title` (text) - Event title/name
      - `estimated_hours` (integer) - Estimated hours to complete
      - `estimated_minutes` (integer) - Estimated minutes to complete
      - `total_focus_time` (integer) - Total time spent in seconds
      - `is_completed` (boolean) - Whether event is completed
      - `created_at` (timestamptz) - Event creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Changes to existing tables
    - Add `event_id` column to `pomodoro_sessions`
    - Update `pomodoro_sessions` to require `user_id` for authenticated users
    - Add foreign key relationships

  3. Security
    - Enable RLS on `events` table
    - Add policies for authenticated users to manage their own events
    - Update `pomodoro_sessions` policies for authenticated users
    - Add policies for users to read their own sessions with event details

  4. Indexes
    - Add indexes for efficient queries on user_id and event_id
    - Add index for sorting by created_at
*/

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  estimated_hours integer NOT NULL DEFAULT 0,
  estimated_minutes integer NOT NULL DEFAULT 0,
  total_focus_time integer NOT NULL DEFAULT 0,
  is_completed boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add event_id to pomodoro_sessions if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pomodoro_sessions' AND column_name = 'event_id'
  ) THEN
    ALTER TABLE pomodoro_sessions ADD COLUMN event_id uuid REFERENCES events(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Events policies
CREATE POLICY "Users can insert own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Update pomodoro_sessions policies for authenticated users with events
CREATE POLICY "Authenticated users can insert own sessions"
  ON pomodoro_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own sessions"
  ON pomodoro_sessions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_event_id ON pomodoro_sessions(event_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
