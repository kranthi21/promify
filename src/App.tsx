import { useState } from 'react';
import { Timer } from './components/Timer';
import { Settings } from './components/Settings';
import { ThemeToggle } from './components/ThemeToggle';
import { Auth } from './components/Auth';
import { EventList } from './components/EventList';
import { EventForm } from './components/EventForm';
import { ActivityFeed } from './components/ActivityFeed';
import { useTheme } from './hooks/useTheme';
import { useAuth } from './hooks/useAuth';
import { useEvents } from './hooks/useEvents';
import { useSessions } from './hooks/useSessions';
import { TimerSettings } from './types/timer';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { user, loading: authLoading, signIn, signUp, signOut } = useAuth();
  const { events, createEvent, updateEvent, deleteEvent, incrementEventFocusTime } = useEvents(
    user?.id
  );
  const { sessions, sortOrder, setSortOrder, createSession } = useSessions(user?.id);

  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    soundEnabled: true,
  });
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSignIn={signIn} onSignUp={signUp} />;
  }

  const selectedEvent = events.find((e) => e.id === selectedEventId);

  const handleSessionComplete = async (cycles: number, totalTime: number) => {
    if (cycles > 0) {
      await createSession(
        selectedEventId,
        settings.workDuration,
        settings.breakDuration,
        cycles,
        totalTime
      );

      if (selectedEventId) {
        await incrementEventFocusTime(selectedEventId, totalTime);
      }
    }
  };

  const handleToggleComplete = async (eventId: string, isCompleted: boolean) => {
    await updateEvent(eventId, { is_completed: isCompleted });
  };

  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Pomify</h1>
        <div className="header-actions">
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <button onClick={signOut} className="sign-out-button">
            Sign Out
          </button>
        </div>
      </div>

      <div className="app-content">
        <div className="main-section">
          <div className="timer-card">
            <Timer
              settings={settings}
              selectedEventTitle={selectedEvent?.title}
              onSessionComplete={handleSessionComplete}
            />
            <Settings settings={settings} onSettingsChange={setSettings} />
          </div>

          <div className="events-section">
            <div className="section-header">
              <h3>Events</h3>
              <button onClick={() => setShowEventForm(true)} className="add-button">
                + Add Event
              </button>
            </div>
            <EventList
              events={events}
              selectedEventId={selectedEventId}
              onSelectEvent={setSelectedEventId}
              onDeleteEvent={deleteEvent}
              onToggleComplete={handleToggleComplete}
            />
          </div>
        </div>

        <div className="sidebar">
          <ActivityFeed
            sessions={sessions}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        </div>
      </div>

      {showEventForm && (
        <EventForm onSubmit={createEvent} onCancel={() => setShowEventForm(false)} />
      )}
    </div>
  );
}

export default App;
