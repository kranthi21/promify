import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Event, EventFormData } from '../types/event';

export const useEvents = (userId: string | undefined) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async () => {
    if (!userId) {
      setEvents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [userId]);

  const createEvent = async (eventData: EventFormData) => {
    if (!userId) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('events')
      .insert([
        {
          user_id: userId,
          title: eventData.title,
          estimated_hours: eventData.estimated_hours,
          estimated_minutes: eventData.estimated_minutes,
        },
      ])
      .select()
      .single();

    if (error) throw error;
    await fetchEvents();
    return data;
  };

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    const { error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId);

    if (error) throw error;
    await fetchEvents();
  };

  const deleteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) throw error;
    await fetchEvents();
  };

  const incrementEventFocusTime = async (eventId: string, seconds: number) => {
    const event = events.find((e) => e.id === eventId);
    if (!event) return;

    await updateEvent(eventId, {
      total_focus_time: event.total_focus_time + seconds,
    });
  };

  return {
    events,
    loading,
    error,
    createEvent,
    updateEvent,
    deleteEvent,
    incrementEventFocusTime,
    refetch: fetchEvents,
  };
};
