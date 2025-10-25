import { useState } from 'react';
import { EventFormData } from '../types/event';

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
}

export const EventForm = ({ onSubmit, onCancel }: EventFormProps) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    estimated_hours: 0,
    estimated_minutes: 30,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onSubmit(formData);
      setFormData({ title: '', estimated_hours: 0, estimated_minutes: 30 });
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="event-form-overlay" onClick={onCancel}>
      <div className="event-form-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Create New Event</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Event Title</label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Build landing page"
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hours">Estimated Hours</label>
              <input
                id="hours"
                type="number"
                min="0"
                value={formData.estimated_hours}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_hours: parseInt(e.target.value) || 0 })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="minutes">Estimated Minutes</label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={formData.estimated_minutes}
                onChange={(e) =>
                  setFormData({ ...formData, estimated_minutes: parseInt(e.target.value) || 0 })
                }
              />
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="secondary-button">
              Cancel
            </button>
            <button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
