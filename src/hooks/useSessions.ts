import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PomodoroSession } from '../types/timer';

export type SortOrder = 'newest' | 'oldest' | 'most_cycles' | 'most_time';

export interface SessionWithEventTitle extends PomodoroSession {
  event_title?: string;
}

export const useSessions = (userId: string | undefined) => {
  const [sessions, setSessions] = useState<SessionWithEventTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');

  const fetchSessions = async () => {
    if (!userId) {
      setSessions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('pomodoro_sessions')
        .select(`
          *,
          events (
            title
          )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const sessionsWithTitles: SessionWithEventTitle[] = (data || []).map((session: any) => ({
        ...session,
        event_title: session.events?.title,
      }));

      setSessions(sessionsWithTitles);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [userId]);

  const createSession = async (
    eventId: string | null,
    workDuration: number,
    breakDuration: number,
    cycles: number,
    totalFocusTime: number
  ) => {
    if (!userId) throw new Error('User not authenticated');

    const { error } = await supabase.from('pomodoro_sessions').insert([
      {
        user_id: userId,
        event_id: eventId,
        work_duration: workDuration,
        break_duration: breakDuration,
        cycles_completed: cycles,
        total_focus_time: totalFocusTime,
      },
    ]);

    if (error) throw error;
    await fetchSessions();
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    switch (sortOrder) {
      case 'newest':
        return new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime();
      case 'oldest':
        return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
      case 'most_cycles':
        return b.cycles_completed - a.cycles_completed;
      case 'most_time':
        return b.total_focus_time - a.total_focus_time;
      default:
        return 0;
    }
  });

  return {
    sessions: sortedSessions,
    loading,
    sortOrder,
    setSortOrder,
    createSession,
    refetch: fetchSessions,
  };
};
