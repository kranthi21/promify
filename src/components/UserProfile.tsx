import { useState } from 'react';
import { Event } from '../types/event';

interface UserProfileProps {
  email: string;
  deletedEvents: Event[];
  onRestore: (eventId: string) => Promise<void>;
  onClose: () => void;
}

export const UserProfile = ({
  email,
  deletedEvents,
  onRestore,
  onClose,
}: UserProfileProps) => {
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const formatDeletedDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

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

  const handleRestore = async (eventId: string) => {
    setRestoringId(eventId);
    try {
      await onRestore(eventId);
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
        <div className="profile-header">
          <h2>User Profile</h2>
          <button onClick={onClose} className="close-button">
            ✕
          </button>
        </div>

        <div className="profile-content">
          <section className="profile-section">
            <h3>Account</h3>
            <div className="profile-info">
              <label>Email:</label>
              <p>{email}</p>
            </div>
          </section>

          <section className="profile-section">
            <h3>Deleted Events ({deletedEvents.length})</h3>
            {deletedEvents.length === 0 ? (
              <div className="empty-deleted">
                <p>No deleted events. Your deleted items will appear here.</p>
              </div>
            ) : (
              <div className="deleted-events-list">
                {deletedEvents.map((event) => (
                  <div key={event.id} className="deleted-event-item">
                    <div className="deleted-event-info">
                      <h4>{event.title}</h4>
                      <div className="deleted-event-meta">
                        <span>Est: {formatEstimated(event.estimated_hours, event.estimated_minutes)}</span>
                        <span>Spent: {formatTime(event.total_focus_time)}</span>
                        <span>Deleted: {event.deleted_at && formatDeletedDate(event.deleted_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRestore(event.id)}
                      disabled={restoringId === event.id}
                      className="restore-button"
                    >
                      {restoringId === event.id ? 'Restoring...' : 'Restore'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
