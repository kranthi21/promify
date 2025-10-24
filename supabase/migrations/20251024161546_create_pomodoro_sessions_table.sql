/*
  # Create pomodoro_sessions table

  1. New Tables
    - `pomodoro_sessions`
      - `id` (uuid, primary key) - Unique session identifier
      - `user_id` (uuid, nullable) - User identifier for future auth integration
      - `work_duration` (integer) - Work duration in minutes
      - `break_duration` (integer) - Break duration in minutes
      - `cycles_completed` (integer) - Number of pomodoro cycles completed
      - `total_focus_time` (integer) - Total focus time in seconds
      - `created_at` (timestamptz) - Session creation timestamp

  2. Security
    - Enable RLS on `pomodoro_sessions` table
    - Add policy for public insert (allows anonymous tracking)
    - Add policy for users to read their own sessions when auth is added

  3. Notes
    - This table tracks pomodoro sessions for analytics
    - user_id is nullable to support both anonymous and authenticated usage
    - Future auth integration will allow users to view their history
*/

CREATE TABLE IF NOT EXISTS pomodoro_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  work_duration integer NOT NULL DEFAULT 25,
  break_duration integer NOT NULL DEFAULT 5,
  cycles_completed integer NOT NULL DEFAULT 0,
  total_focus_time integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE pomodoro_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for session tracking"
  ON pomodoro_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can read own sessions"
  ON pomodoro_sessions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_user_id ON pomodoro_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_pomodoro_sessions_created_at ON pomodoro_sessions(created_at DESC);
