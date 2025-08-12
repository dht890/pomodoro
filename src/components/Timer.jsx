import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import bellIcon from '../assets/bell.svg';
import alarmSound from '../assets/reels.mp3';
import styles from '../css/timer.module.css'
import { useTheme } from '../contexts/ThemeContext';
import { useMode } from '../contexts/ModeContext';
import { useTimer } from '../contexts/TimerContext';

/**
 * CountdownTimer Component
 * A Pomodoro timer that alternates between work and break modes.
 * Features:
 * - Work mode (25 minutes) and Break mode (5 minutes)
 * - Start, stop, and reset functionality
 * - Audio notification when timer completes
 * - Keyboard navigation support
 * - Automatic mode switching when timer completes
 */

// Timer state reducer
function timerReducer(state, action) {
    switch (action.type) {
        case 'START_TIMER':
            return {
                ...state,
                // If resuming from pause, keep current time. If starting fresh, use full duration
                time: action.fromPause ? state.time : action.duration,
                baseTime: action.fromPause ? state.time : action.duration,
                startTimestamp: Date.now() - (action.fromPause ? (state.baseTime - state.time) : 0),
                isRunning: true
            };
        case 'STOP_TIMER':
            return {
                ...state,
                isRunning: false
            };
        case 'SET_TIME':
            return {
                ...state,
                time: action.time
            };
        case 'RESET_TIMER':
            return {
                ...state,
                time: action.duration,
                baseTime: action.duration,
                isRunning: false
            };
        case 'MODE_CHANGE':
            return {
                ...state,
                time: action.duration,
                baseTime: action.duration,
                isRunning: false
            };
        default:
            return state;
    }
}

function CountdownTimer() {
    // Context hooks for mode, theme, and timer settings
    const { mode, toggleMode } = useMode();
    const { themeColor } = useTheme();
    const { getCurrentDuration } = useTimer();

    // Replace multiple useState with useReducer
    const [timerState, dispatch] = useReducer(timerReducer, {
        time: getCurrentDuration(mode),
        baseTime: getCurrentDuration(mode),
        isRunning: false
    });

    const [pressedButton, setPressedButton] = useState(null);

    // Refs for DOM elements and timer management
    const startButtonRef = useRef(null);
    const resetButtonRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const workButtonRef = useRef(null);
    const breakButtonRef = useRef(null);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
    const navigate = useNavigate();

    // Handlers for mode switching
    const handleWorkMode = useCallback(() => {
        toggleMode('work');
    }, [toggleMode]);

    const handleBreakMode = useCallback(() => {
        toggleMode('break');
    }, [toggleMode]);

    // Effect to handle mode changes
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        const newDuration = getCurrentDuration(mode);
        console.log('Mode changed to:', mode, 'New duration:', newDuration);
        dispatch({ type: 'MODE_CHANGE', duration: newDuration });
    }, [mode, getCurrentDuration]);

    // Main timer effect - handles countdown logic
    useEffect(() => {
        if (timerState.isRunning && timerState.time > 0) {
            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - timerState.startTimestamp;
                const newTime = timerState.baseTime - elapsed;

                if (newTime <= 0) {
                    clearInterval(intervalRef.current);
                    dispatch({ type: 'STOP_TIMER' });
                    playSound();
                    const nextMode = mode === 'work' ? 'break' : 'work';
                    toggleMode(nextMode);
                    const nextDuration = getCurrentDuration(nextMode);
                    dispatch({ type: 'MODE_CHANGE', duration: nextDuration });
                } else {
                    dispatch({ type: 'SET_TIME', time: newTime });
                }
            }, 1000); // once per second is enough
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [timerState.isRunning, timerState.startTimestamp, timerState.baseTime, mode, toggleMode, getCurrentDuration]);


    // Keyboard navigation and control effect
    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        setPressedButton('reset');
                        resetTimer();
                    } else if (document.activeElement === settingsButtonRef.current) {
                        setPressedButton('settings');
                        navigate('/settings');
                    } else if (document.activeElement === startButtonRef.current) {
                        setPressedButton('start');
                        if (timerState.isRunning) {
                            console.log('Stopping timer with spacebar. Time:', timerState.time);
                            stopTimer();
                        } else {
                            console.log('Starting timer with spacebar. Time:', timerState.time);
                            startTimer();
                        }
                    } else if (document.activeElement === workButtonRef.current) {
                        console.log('Switching to work mode with spacebar. Time:', timerState.time);
                        setPressedButton('work');
                        handleWorkMode();
                    } else if (document.activeElement === breakButtonRef.current) {
                        console.log('Switching to break mode with spacebar. Time:', timerState.time);
                        setPressedButton('break');
                        handleBreakMode();
                    }
                    break;
                case 'ArrowLeft':
                    // Handle left arrow navigation between buttons
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        startButtonRef.current.focus();
                    } else if (document.activeElement === settingsButtonRef.current) {
                        resetButtonRef.current.focus();
                    } else if (document.activeElement === startButtonRef.current) {
                        settingsButtonRef.current.focus();
                    } else if (document.activeElement === workButtonRef.current) {
                        breakButtonRef.current.focus();
                    } else if (document.activeElement === breakButtonRef.current) {
                        workButtonRef.current.focus();
                    }
                    break;
                case 'ArrowRight':
                    // Handle right arrow navigation between buttons
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        settingsButtonRef.current.focus();
                    } else if (document.activeElement === settingsButtonRef.current) {
                        startButtonRef.current.focus();
                    } else if (document.activeElement === startButtonRef.current) {
                        resetButtonRef.current.focus();
                    } else if (document.activeElement === workButtonRef.current) {
                        breakButtonRef.current.focus();
                    } else if (document.activeElement === breakButtonRef.current) {
                        workButtonRef.current.focus();
                    }
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    workButtonRef.current.focus();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    startButtonRef.current.focus();
                    break;
            }
        };

        const handleKeyUp = (event) => {
            if (event.code === 'Space') {
                setPressedButton(null);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [timerState.isRunning, timerState.time, navigate, handleWorkMode, handleBreakMode]);

    // Focus start button on component mount
    useEffect(() => {
        startButtonRef.current?.focus();
    }, []);

    /**
     * Starts or resumes the timer
     * If timer is at 0, resets to full duration
     * If timer was paused, resumes from current time
     */
    function startTimer() {
        if (timerState.time <= 0) {
            // If timer is expired, start fresh with full duration
            const currentDuration = getCurrentDuration(mode);
            console.log('Starting fresh timer for mode:', mode, 'with duration:', currentDuration);
            dispatch({ type: 'START_TIMER', duration: currentDuration, fromPause: false });
        } else {
            // If timer was paused, resume from current time
            console.log('Resuming timer from:', timerState.time);
            dispatch({ type: 'START_TIMER', duration: timerState.time, fromPause: true });
        }
        cleanupAudio();
    }

    /**
     * Pauses the timer
     */
    function stopTimer() {
        dispatch({ type: 'STOP_TIMER' });
        cleanupAudio();
    }

    /**
     * Cleans up any playing audio
     * Called when stopping timer or switching modes
     */
    const cleanupAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    };

    /**
     * Resets the timer to the full duration of current mode
     */
    function resetTimer() {
        const currentDuration = getCurrentDuration(mode);
        dispatch({ type: 'RESET_TIMER', duration: currentDuration });
        cleanupAudio();
    }

    /**
     * Formats milliseconds into HH:MM:SS:MS display format
     */
    function formatTime(time) {
        const totalSeconds = Math.floor(time / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }

    /**
     * Calculates and formats the end time display (when timer will complete)
     */
    function formatEndTime(time) {
        const end = new Date(Date.now() + time);
        let hours = end.getHours();
        const minutes = end.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }

    /**
     * Plays the completion sound
     * Creates a new audio instance and loops it until stopped
     */
    function playSound() {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        const audio = new Audio(alarmSound);
        audio.loop = true;
        audio.play();
        audioRef.current = audio;
    }

    // Cleanup effect for audio when navigating away
    useEffect(() => {
        const cleanupAudio = () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };

        window.addEventListener('popstate', cleanupAudio);

        return () => {
            window.removeEventListener('popstate', cleanupAudio);
            cleanupAudio(); // Also clean up when component unmounts
        };
    }, []);

    // Update background color based on theme
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
                    onClick={handleWorkMode}
                    className={`${styles.pomodoro_button} ${mode === 'work' ? styles.active : ''} ${pressedButton === 'work' ? 'space-pressed' : ''}`}>
                    Work
                </button>
                <button
                    ref={breakButtonRef}
                    onClick={handleBreakMode}
                    className={`${styles.pomodoro_button} ${mode === 'break' ? styles.active : ''} ${pressedButton === 'break' ? 'space-pressed' : ''}`}>
                    Break
                </button>
            </div>
            <div className={styles.end_time}>
                <img src={bellIcon} alt="Timer" className={styles.bell_icon} />
                {formatEndTime(timerState.time)}
            </div>
            <div className={styles.timer_display}>{formatTime(timerState.time)}</div>
            <div>
                <p className={styles.disclaimer}>Audio may not play if left in the background.</p>
            </div>
            <div className='controls'>
                <button
                    ref={settingsButtonRef}
                    onClick={() => navigate('/settings')}
                    className={`small_button ${pressedButton === 'settings' ? 'space-pressed' : ''}`}>
                    Set
                </button>
                <button
                    ref={startButtonRef}
                    onClick={timerState.isRunning ? stopTimer : startTimer}
                    className={pressedButton === 'start' ? 'space-pressed' : ''}
                    disabled={timerState.time <= 0}>
                    {(timerState.isRunning ? "Stop" : "Start")}
                </button>
                <button
                    ref={resetButtonRef}
                    onClick={resetTimer}
                    className={`small_button ${pressedButton === 'reset' ? 'space-pressed' : ''}`}>
                    Reset
                </button>
            </div>
        </div>
    );
}

export default CountdownTimer;