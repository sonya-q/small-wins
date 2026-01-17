import { useState, useEffect } from 'react';
import './App.css';
import { storage } from './utils/storage';
import { notifications } from './utils/notifications';

const MAX_CHARS = 280;

function App() {
  const [view, setView] = useState('input'); // 'input' or 'list'
  const [inputText, setInputText] = useState('');
  const [wins, setWins] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasWinToday, setHasWinToday] = useState(false);

  useEffect(() => {
    // Load wins from storage
    setWins(storage.getAllWins());
    setHasWinToday(storage.hasWinToday());
    
    // Request notification permission and schedule
    notifications.requestPermission().then(granted => {
      if (granted) {
        notifications.scheduleDaily();
      }
    });
  }, []);

  const handleSave = () => {
    if (inputText.trim() && inputText.length <= MAX_CHARS) {
      const newWin = storage.saveWin(inputText);
      setWins([...wins, newWin]);
      setInputText('');
      setShowSuccess(true);
      setHasWinToday(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSkip = () => {
    setInputText('');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const remainingChars = MAX_CHARS - inputText.length;
  const isOverLimit = remainingChars < 0;

  return (
    <div className="app-container">
      {view === 'input' ? (
        <>
          <header className="app-header">
            <h1 className="app-title">Small Wins</h1>
            <p className="app-subtitle">One moment at a time</p>
          </header>

          {showSuccess && (
            <div className="success-message">
              ✓ Saved! Keep collecting the good things.
            </div>
          )}

          <div className="input-card">
            <label className="input-label">
              {hasWinToday 
                ? "Add another moment worth keeping..."
                : "Name one moment worth keeping."}
            </label>
            
            <textarea
              className="win-input"
              placeholder="Today's small win…"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.metaKey) {
                  handleSave();
                }
              }}
              maxLength={MAX_CHARS + 50} // Allow typing a bit over to show warning
            />
            
            <div className={`char-count ${isOverLimit ? 'warning' : ''}`}>
              {isOverLimit 
                ? `${Math.abs(remainingChars)} characters over limit`
                : `${remainingChars} characters remaining`}
            </div>

            <div className="button-group">
              <button 
                className="btn btn-primary" 
                onClick={handleSave}
                disabled={!inputText.trim() || isOverLimit}
              >
                Save
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={handleSkip}
                disabled={!inputText.trim()}
              >
                Clear
              </button>
            </div>
          </div>

          {wins.length > 0 && (
            <div className="view-toggle">
              <button 
                className="btn-view-all"
                onClick={() => setView('list')}
              >
                See all the good things ({wins.length})
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="list-view">
          <div className="list-header">
            <h2 className="list-title">All the Good Things</h2>
            <button className="btn-back" onClick={() => setView('input')}>
              ← Back
            </button>
          </div>

          {wins.length === 0 ? (
            <div className="empty-state">
              <h3 className="empty-state-title">No wins yet</h3>
              <p className="empty-state-text">
                Start collecting the moments that matter.
              </p>
            </div>
          ) : (
            <div className="wins-list">
              {[...wins].reverse().map((win, index) => (
                <div 
                  key={win.id} 
                  className="win-item"
                  style={{ '--i': index }}
                >
                  <div className="win-date">{formatDate(win.date)}</div>
                  <div className="win-text">{win.text}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;