export const safeStorage = {
  getItem: (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const value = localStorage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  setItem: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, value);
    } catch {
      // ignore
    }
  },
  removeItem: (key) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
  getJSON: (key, defaultValue = null) => {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  setJSON: (key, value) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }
};

