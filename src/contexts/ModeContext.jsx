import { createContext, useContext, useState } from 'react';
import { useTheme } from './ThemeContext';

const ModeContext = createContext();

export function ModeProvider({ children }) {
    const [mode, setMode] = useState('work'); // Default mode
    const { setThemeColor } = useTheme();

    const toggleMode = (newMode) => {
        setMode(newMode);
        // Sync theme color with mode
        setThemeColor(newMode === 'work' ? 'green' : 'teal');
    };

    const value = {
        mode,
        toggleMode
    };

    return (
        <ModeContext.Provider value={value}>
            {children}
        </ModeContext.Provider>
    );
}

export function useMode() {
    const context = useContext(ModeContext);
    if (context === undefined) {
        throw new Error('useMode must be used within a ModeProvider');
    }
    return context;
} 