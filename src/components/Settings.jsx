import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from '../css/settings.module.css';
import { useTheme } from '../contexts/ThemeContext';
import { useMode } from '../contexts/ModeContext';

function formatTimeInput(raw) {
    let digits = raw.padStart(6, '0');
    let h = digits.slice(0, 2);
    let m = digits.slice(2, 4);
    let s = digits.slice(4, 6);
    return `${h}:${m}:${s}`;
}

function Settings({ setDuration }) {
    const navigate = useNavigate();
    const [raw, setRaw] = useState('');
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const saveButtonRef = useRef(null);
    const clearButtonRef = useRef(null);
    const [pressedButton, setPressedButton] = useState(null);
    const { themeColor, setThemeColor } = useTheme();
    const { mode, toggleMode } = useMode();

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Global ArrowUp handler to always focus input
    useEffect(() => {
        const handleArrowUp = (e) => {
            if (e.key === 'ArrowUp') {
                inputRef.current?.focus();
                e.preventDefault();
            }
        };
        window.addEventListener('keydown', handleArrowUp);
        return () => window.removeEventListener('keydown', handleArrowUp);
    }, []);

    // Keyboard support for time input (numbers, backspace, tab, enter)
    const handleKeyDown = (e) => {
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
        } else if (e.key === 'Tab') {
            // Allow tab
        } else if (e.key === 'ArrowDown') {
            // Move focus to Save button
            saveButtonRef.current?.focus();
            e.preventDefault();
        } else {
            e.preventDefault();
        }
    };

    const handleSave = () => {
        let digits = raw.padStart(6, '0');
        let h = parseInt(digits.slice(0, 2)) || 0;
        let m = parseInt(digits.slice(2, 4)) || 0;
        let s = parseInt(digits.slice(4, 6)) || 0;
        const duration = (h * 3600 + m * 60 + s) * 1000;
        if (duration > 0) {
            setError('');
            setDuration(duration);
            navigate('/timer');
        } else {
            setError('Time cannot be set to zero');
        }
    };

    const handleClear = () => {
        setRaw('');
        setError('');
    };

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
                    onClick={() => toggleMode('work')}
                    className={`${styles.pomodoro_button} ${mode === 'work' ? styles.active : ''}`}>
                    Work
                </button>
                <button 
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
                    onKeyDown={handleKeyDown}
                    readOnly
                    maxLength={8}
                    placeholder="00:00:00"
                />
            </div>
            <div className={styles.error_message}>
                {error ? error : " "}
            </div>
            <div className="controls">
                <button
                    ref={saveButtonRef}
                    onClick={handleSave}
                    onKeyDown={e => {
                        if (e.code === 'ArrowRight') {
                            clearButtonRef.current.focus();
                            e.preventDefault();
                        } else if (e.code === 'Space' || e.code === 'Enter') {
                            setPressedButton('save');
                            handleSave();
                            e.preventDefault();
                        }
                    }}
                    onKeyUp={e => {
                        if (e.code === 'Space' || e.code === 'Enter') setPressedButton(null);
                    }}
                    className={pressedButton === 'save' ? 'space-pressed' : ''}
                >
                    Save
                </button>
                <button
                    ref={clearButtonRef}
                    onClick={handleClear}
                    onKeyDown={e => {
                        if (e.code === 'ArrowLeft') {
                            saveButtonRef.current.focus();
                            e.preventDefault();
                        } else if (e.code === 'Space' || e.code === 'Enter') {
                            setPressedButton('clear');
                            handleClear();
                            e.preventDefault();
                        }
                    }}
                    onKeyUp={e => {
                        if (e.code === 'Space' || e.code === 'Enter') setPressedButton(null);
                    }}
                    className={pressedButton === 'clear' ? 'space-pressed' : ''}
                >
                    Clear
                </button>
            </div>
        </div>
    );
}

export default Settings;