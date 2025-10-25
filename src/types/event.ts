export interface Event {
  id: string;
  user_id: string;
  title: string;
  estimated_hours: number;
  estimated_minutes: number;
  total_focus_time: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventFormData {
  title: string;
  estimated_hours: number;
  estimated_minutes: number;
}
