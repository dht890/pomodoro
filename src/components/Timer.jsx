import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import bellIcon from '../assets/bell.svg';
import alarmSound from '../assets/reels.mp3';
import styles from '../css/timer.module.css'

function CountdownTimer({ duration }) {
    const [time, setTime] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [pressedButton, setPressedButton] = useState(null);
    const [baseTime, setBaseTime] = useState(duration);
    const startButtonRef = useRef(null);
    const resetButtonRef = useRef(null);
    const settingsButtonRef = useRef(null);
    const intervalRef = useRef(null);
    const audioRef = useRef(null);
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
                        playSound();
                        return 0;
                    }
                    return newTime;
                });
            }, 10);
        } else if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
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
                        if (startButtonRef.current.disabled) {
                            settingsButtonRef.current.focus()
                        }
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
                        if (startButtonRef.current.disabled) {
                            resetButtonRef.current.focus();
                        }
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

    const cleanupAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current = null;
        }
    };

    function resetTimer() {
        setIsRunning(false);
        setTime(duration);
        setBaseTime(duration);
        cleanupAudio();
    }

    function formatTime(time) {
        const totalSeconds = Math.floor(time / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    function formatEndTime(time) {
        const end = new Date(Date.now() + time);
        let hours = end.getHours();
        const minutes = end.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        if (hours === 0) hours = 12;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${ampm}`;
    }

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

    // Add cleanup effect that runs before navigation
    useEffect(() => {
        const cleanupAudio = () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
                audioRef.current = null;
            }
        };

        // Clean up audio before navigation
        window.addEventListener('popstate', cleanupAudio);

        return () => {
            window.removeEventListener('popstate', cleanupAudio);
            cleanupAudio(); // Also clean up when component unmounts
        };
    }, []);

    return (
            <div className='card'>
                <div className={styles.pomodoro}>
                    <button>Work</button>
                    <button>Break</button>
                </div>
                <div className={styles.end_time}>
                    <img src={bellIcon} alt="Timer" className={styles.bell_icon}/>
                    {formatEndTime(time)}
                </div>
                <div className={styles.timer_display}>{formatTime(time)}</div>
                <div className='controls'>
                    <button
                        ref={settingsButtonRef}
                        onClick={() => navigate('/settings')}
                        className={`small_button ${pressedButton === 'settings' ? 'space-pressed' : ''}`}
                    >
                        Set
                    </button>
                    <button
                        ref={startButtonRef}
                        onClick={isRunning ? stopTimer : startTimer}
                        className={pressedButton === 'start' ? 'space-pressed' : ''}
                        disabled={time <= 0}
                    >
                        {(isRunning ? "Stop" : "Start")}

                    </button>
                    <button
                        ref={resetButtonRef}
                        onClick={resetTimer}
                        className={`small_button ${pressedButton === 'reset' ? 'space-pressed' : ''}`}
                    >
                        Reset
                    </button>
                </div>
            </div>
    );
}

export default CountdownTimer;