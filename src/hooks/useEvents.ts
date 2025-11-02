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
        .eq('is_deleted', false)
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

  const softDeleteEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', eventId);

    if (error) throw error;
    await fetchEvents();
  };

  const restoreEvent = async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .update({ is_deleted: false, deleted_at: null })
      .eq('id', eventId);

    if (error) throw error;
    await fetchEvents();
  };

  const fetchDeletedEvents = async () => {
    if (!userId) return [];

    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('user_id', userId)
        .eq('is_deleted', true)
        .order('deleted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Failed to fetch deleted events:', err);
      return [];
    }
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
    softDeleteEvent,
    restoreEvent,
    fetchDeletedEvents,
    incrementEventFocusTime,
    refetch: fetchEvents,
  };
};
