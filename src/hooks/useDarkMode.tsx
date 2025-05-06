
import { useState, useEffect, createContext, useContext } from 'react';

type DarkModeContextType = {
  isDark: boolean;
  toggleDarkMode: () => void;
};

const DarkModeContext = createContext<DarkModeContextType>({
  isDark: false,
  toggleDarkMode: () => {},
});

export const DarkModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('uniPortalTheme');
    
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDark(systemPrefersDark);
    }
  }, []);

  // Update document class and localStorage when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      // Add a class to fix text input visibility in dark mode
      document.documentElement.classList.add('dark-inputs');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.remove('dark-inputs');
    }
    
    localStorage.setItem('uniPortalTheme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleDarkMode = () => setIsDark(!isDark);

  return (
    <DarkModeContext.Provider value={{ isDark, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};

export const useDarkMode = () => useContext(DarkModeContext);
