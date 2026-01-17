const STORAGE_KEY = 'small-wins-entries';

export const storage = {
  getAllWins: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  },

  saveWin: (text) => {
    const wins = storage.getAllWins();
    const newWin = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
      text: text.trim(),
      timestamp: new Date().toISOString()
    };
    
    wins.push(newWin);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wins));
    return newWin;
  },

  hasWinToday: () => {
    const wins = storage.getAllWins();
    const today = new Date().toISOString().split('T')[0];
    return wins.some(win => win.date === today);
  }
};