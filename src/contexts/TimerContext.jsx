import { createContext, useContext, useState } from 'react';

const TimerContext = createContext();

export function TimerProvider({ children }) {
    const [workDuration, setWorkDuration] = useState(25 * 60 * 1000); // 25 minutes default
    const [breakDuration, setBreakDuration] = useState(5 * 60 * 1000); // 5 minutes default

    const getCurrentDuration = (mode) => {
        return mode === 'work' ? workDuration : breakDuration;
    };

    const value = {
        workDuration,
        breakDuration,
        setWorkDuration,
        setBreakDuration,
        getCurrentDuration
    };

    return (
        <TimerContext.Provider value={value}>
            {children}
        </TimerContext.Provider>
    );
}

export function useTimer() {
    const context = useContext(TimerContext);
    if (context === undefined) {
        throw new Error('useTimer must be used within a TimerProvider');
    }
    return context;
} 