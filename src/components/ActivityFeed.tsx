import { SessionWithEventTitle, SortOrder } from '../hooks/useSessions';

interface ActivityFeedProps {
  sessions: SessionWithEventTitle[];
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export const ActivityFeed = ({ sessions, sortOrder, onSortChange }: ActivityFeedProps) => {
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (sessions.length === 0) {
    return (
      <div className="activity-feed">
        <div className="feed-header">
          <h3>Activity Feed</h3>
        </div>
        <div className="empty-state">
          <p>No sessions yet. Start a timer to track your work!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="activity-feed">
      <div className="feed-header">
        <h3>Activity Feed</h3>
        <select
          value={sortOrder}
          onChange={(e) => onSortChange(e.target.value as SortOrder)}
          className="sort-select"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="most_cycles">Most Cycles</option>
          <option value="most_time">Most Time</option>
        </select>
      </div>
      <div className="feed-list">
        {sessions.map((session) => (
          <div key={session.id} className="feed-item">
            <div className="feed-item-header">
              <span className="event-title">
                {session.event_title || 'No event'}
              </span>
              <span className="session-time">
                {session.created_at && formatDate(session.created_at)}
              </span>
            </div>
            <div className="feed-item-stats">
              <span className="stat-badge">
                {session.cycles_completed} cycle{session.cycles_completed !== 1 ? 's' : ''}
              </span>
              <span className="stat-badge">
                {formatTime(session.total_focus_time)} focused
              </span>
              <span className="stat-badge muted">
                {session.work_duration}m / {session.break_duration}m
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
