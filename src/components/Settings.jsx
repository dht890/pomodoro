import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useMode } from '../contexts/ModeContext';
import { useTimer } from '../contexts/TimerContext';
import styles from '../css/settings.module.css';

function formatTimeInput(raw) {
    let digits = raw.padStart(6, '0');
    let h = digits.slice(0, 2);
    let m = digits.slice(2, 4);
    let s = digits.slice(4, 6);
    return `${h}:${m}:${s}`;
}

function Settings() {
    const navigate = useNavigate();
    const [raw, setRaw] = useState('');
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState('');
    const inputRef = useRef(null);
    const saveButtonRef = useRef(null);
    const clearButtonRef = useRef(null);

    const backButtonRef = useRef(null);
    const workButtonRef = useRef(null);
    const breakButtonRef = useRef(null);

    const [pressedButton, setPressedButton] = useState(null);
    const { themeColor, setThemeColor } = useTheme();
    const { mode, toggleMode } = useMode();
    const { setWorkDuration, setBreakDuration } = useTimer();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Reset input when mode changes
    useEffect(() => {
        setRaw('');
        setError('');
        setConfirmation('');
    }, [mode]);

    // Clear confirmation message after 2 seconds
    useEffect(() => {
        if (confirmation) {
            const timer = setTimeout(() => {
                setConfirmation('');
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [confirmation]);
   
    // Handle numeric input and basic input controls
    const handleInputKeyDown = (e) => {
        if (e.key >= '0' && e.key <= '9') {
            if (raw.length < 6) setRaw(raw + e.key);
            setError('');
            e.preventDefault();
        } else if (e.key === 'Backspace') {
            setRaw(raw.slice(0, -1));
            setError('');
            e.preventDefault();
        } else if (e.key === 'Enter') {
            handleSave();
            e.preventDefault();
        } else {
            e.preventDefault();
        }
    };

    // Handle navigation between elements
    const handleNavigation = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                if (document.activeElement === inputRef.current) {
                    workButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === saveButtonRef.current ||
                           document.activeElement === clearButtonRef.current ||
                           document.activeElement === backButtonRef.current
                ) {
                    inputRef.current.focus();
                    e.preventDefault();
                } 
                break;
            case 'ArrowDown':
                if (document.activeElement === inputRef.current) {
                    saveButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === workButtonRef.current ||
                           document.activeElement === breakButtonRef.current
                ) {
                    inputRef.current.focus();
                    e.preventDefault();
                }
                break;
            case 'ArrowRight':
                if (document.activeElement === saveButtonRef.current) {
                    clearButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === clearButtonRef.current) {
                    backButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === backButtonRef.current) {
                    saveButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === workButtonRef.current) {
                    breakButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === breakButtonRef.current) {
                    workButtonRef.current.focus();
                    e.preventDefault();
                }
                break;
            case 'ArrowLeft':
                if (document.activeElement === saveButtonRef.current) {
                    backButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === backButtonRef.current) {
                    clearButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === clearButtonRef.current) {
                    saveButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === workButtonRef.current){
                    breakButtonRef.current.focus();
                    e.preventDefault();
                } else if (document.activeElement === breakButtonRef.current) {
                    workButtonRef.current.focus();
                    e.preventDefault();
                }
                break;
        }   
    };

    // Add global event listener for navigation
    useEffect(() => {
        window.addEventListener('keydown', handleNavigation);
        return () => {
            window.removeEventListener('keydown', handleNavigation);
        };
    }, []); // No dependencies needed since we're not using any state in navigation

    const handleSave = () => {
        let digits = raw.padStart(6, '0');
        let h = parseInt(digits.slice(0, 2)) || 0;
        let m = parseInt(digits.slice(2, 4)) || 0;
        let s = parseInt(digits.slice(4, 6)) || 0;
        const duration = (h * 3600 + m * 60 + s) * 1000;
        if (duration > 0) {
            setError('');
            if (mode === 'work') {
                setWorkDuration(duration);
                setConfirmation(`Work duration set to ${formatTimeInput(raw)}`);
            } else {
                setBreakDuration(duration);
                setConfirmation(`Break duration set to ${formatTimeInput(raw)}`);
            }
        } else {
            setError('Time cannot be set to zero');
        }
    };

    const handleClear = () => {
        setRaw('');
        setError('');
        setConfirmation('');
    };

    // Theme color background
    useEffect(() => {
        if (themeColor === 'teal') {
            document.body.style.backgroundColor = 'rgb(32, 100, 105)'; //darker teal
        } else if (themeColor === 'green') {
            document.body.style.backgroundColor = 'rgb(26, 59, 29)'; //darker green
        } 
    }, [themeColor]);

    return (
        <div className={`card ${themeColor}`}>
            <div className={styles.pomodoro}>
                <button 
                    ref={workButtonRef}
                    onClick={() => toggleMode('work')}
                    className={`${styles.pomodoro_button} ${mode === 'work' ? styles.active : ''}`}>
                    Work
                </button>
                <button 
                    ref={breakButtonRef}
                    onClick={() => toggleMode('break')}
                    className={`${styles.pomodoro_button} ${mode === 'break' ? styles.active : ''}`}>
                    Break
                </button>
            </div>
            <h2>Type to set duration</h2>
            <div className={styles.settings_display}>
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.time_input}
                    value={raw === '' ? '' : formatTimeInput(raw)}
                    onKeyDown={handleInputKeyDown}
                    readOnly
                    maxLength={8}
                    placeholder="00:00:00"
                />
            </div>
            <div className={styles.message}>
                {error ? <span className={styles.error}>{error}</span> : 
                 confirmation ? <span className={styles.confirmation}>{confirmation}</span> : " "}
            </div>
            <div className="controls">
                <button 
                    ref={backButtonRef}
                    onClick={() => navigate('/timer')}
                    className={`small_button ${pressedButton === 'back' ? 'space-pressed' : ''}`}
                >
                    Back
                </button>
                <button
                    ref={saveButtonRef}
                    onClick={handleSave}
                    className={pressedButton === 'save' ? 'space-pressed' : ''}
                >
                    Save
                </button>
                <button
                    ref={clearButtonRef}
                    onClick={handleClear}
                    className={`small_button ${pressedButton === 'clear' ? 'space-pressed' : ''}`}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default Settings;