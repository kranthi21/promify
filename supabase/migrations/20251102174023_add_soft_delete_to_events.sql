/*
  # Add Soft Delete to Events

  1. Changes
    - Add `is_deleted` column to events table (boolean, default false)
    - Add `deleted_at` column to track when event was deleted
    - Update RLS policies to exclude soft-deleted events from normal views
    - Add policy to allow users to view deleted events in profile

  2. Security
    - Ensure deleted events don't appear in regular event lists
    - Allow users to restore their deleted events
    - Maintain RLS restrictions on deleted events

  3. Indexes
    - Add index for filtering deleted events efficiently
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'is_deleted'
  ) THEN
    ALTER TABLE events ADD COLUMN is_deleted boolean NOT NULL DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'events' AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE events ADD COLUMN deleted_at timestamptz;
  END IF;
END $$;

DROP POLICY IF EXISTS "Users can view own events" ON events;
DROP POLICY IF EXISTS "Users can update own events" ON events;

CREATE POLICY "Users can view own active events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND is_deleted = false);

CREATE POLICY "Users can view own deleted events"
  ON events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id AND is_deleted = true);

CREATE POLICY "Users can update own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_events_is_deleted ON events(is_deleted);
CREATE INDEX IF NOT EXISTS idx_events_deleted_at ON events(deleted_at DESC);
