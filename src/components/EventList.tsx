import { Event } from '../types/event';

interface EventListProps {
  events: Event[];
  selectedEventId: string | null;
  onSelectEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
  onToggleComplete: (eventId: string, isCompleted: boolean) => void;
}

export const EventList = ({
  events,
  selectedEventId,
  onSelectEvent,
  onDeleteEvent,
  onToggleComplete,
}: EventListProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatEstimated = (hours: number, minutes: number) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  if (events.length === 0) {
    return (
      <div className="empty-state">
        <p>No events yet. Create one to get started!</p>
      </div>
    );
  }

  return (
    <div className="event-list">
      {events.map((event) => (
        <div
          key={event.id}
          className={`event-item ${selectedEventId === event.id ? 'selected' : ''} ${
            event.is_completed ? 'completed' : ''
          }`}
          onClick={() => onSelectEvent(event.id)}
        >
          <div className="event-header">
            <h3>{event.title}</h3>
            <div className="event-actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(event.id, !event.is_completed);
                }}
                className="icon-button"
                title={event.is_completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {event.is_completed ? '✓' : '○'}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Delete this event?')) {
                    onDeleteEvent(event.id);
                  }
                }}
                className="icon-button delete"
                title="Delete event"
              >
                ×
              </button>
            </div>
          </div>
          <div className="event-stats">
            <span className="stat">
              Est: {formatEstimated(event.estimated_hours, event.estimated_minutes)}
            </span>
            <span className="stat">Spent: {formatTime(event.total_focus_time)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
