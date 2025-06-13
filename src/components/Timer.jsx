import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/card.css'

function CountdownTimer({ duration }) {
    const [time, setTime] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [pressedButton, setPressedButton] = useState(null);
    const [baseTime, setBaseTime] = useState(duration);
    const startButtonRef = useRef(null);
    const resetButtonRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        setTime(duration);
        setBaseTime(duration);
    }, [duration]);

    useEffect(() => {
        if (isRunning && time > 0) {
            const startTimestamp = Date.now();
            intervalRef.current = setInterval(() => {
                const elapsed = Date.now() - startTimestamp;
                setTime(prevTime => {
                    const newTime = baseTime - elapsed;
                    if (newTime <= 0) {
                        clearInterval(intervalRef.current);
                        setIsRunning(false);
                        setBaseTime(duration); // Reset baseTime for next start
                        return 0;
                    }
                    return newTime;
                });
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, baseTime, duration]);

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
                        if (isRunning) {
                            stopTimer();
                        } else {
                            startTimer();
                        }
                    }
                    break;
                case 'ArrowLeft':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        startButtonRef.current.focus();
                    } else if (document.activeElement === settingsButtonRef.current) {
                        resetButtonRef.current.focus();
                    } else {
                        settingsButtonRef.current.focus();
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        settingsButtonRef.current.focus();
                    } else if (document.activeElement === settingsButtonRef.current) {
                        startButtonRef.current.focus();
                    } else {
                        resetButtonRef.current.focus();
                    }
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
    }, [isRunning]);

    useEffect(() => {
        startButtonRef.current?.focus();
    }, []);

    function startTimer() {
        if (time <= 0) {
            setTime(duration);
            setBaseTime(duration);
            setIsRunning(true);
        } else {
            setBaseTime(time);
            setIsRunning(true);
        }
    }

    function stopTimer() {
        setIsRunning(false);
    }

    function resetTimer() {
        setIsRunning(false);
        setTime(duration);
        setBaseTime(duration);
    }

    function formatTime(time) {
        const totalSeconds = Math.floor(time / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const milliseconds = String(Math.floor(time % 1000)).padStart(3, '0');
        return `${hours}:${minutes}:${seconds}.${milliseconds}`;
    }

    return (
        <div className="card">
            <div className='display'>{formatTime(time)}</div>
            <div className='controls'>
                <button
                    ref={settingsButtonRef}
                    onClick={() => navigate('/settings')}
                    className={`settings_button ${pressedButton === 'settings' ? 'space-pressed' : ''}`}
                >
                    Set
                </button>
                <button 
                    ref={startButtonRef}
                    onClick={isRunning ? stopTimer : startTimer}
                    className={pressedButton === 'start' ? 'space-pressed' : ''}
                >
                    {time <= 0 ? "Reset" : (isRunning ? "Stop" : "Start")}
                </button>
                <button 
                    ref={resetButtonRef}
                    onClick={resetTimer}
                    className={`reset_button ${pressedButton === 'reset' ? 'space-pressed' : ''}`}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default CountdownTimer;