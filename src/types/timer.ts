export interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  soundEnabled: boolean;
}

export interface TimerState {
  remaining: number;
  isRunning: boolean;
  isWork: boolean;
  cycles: number;
}

export interface PomodoroSession {
  id?: string;
  user_id?: string;
  event_id?: string;
  work_duration: number;
  break_duration: number;
  cycles_completed: number;
  total_focus_time: number;
  created_at?: string;
}

export interface SessionWithEvent extends PomodoroSession {
  event_title?: string;
}
