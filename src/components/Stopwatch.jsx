import { useState, useEffect, useRef } from 'react';
import styles from '../css/stopwatch.module.css';
import { useTheme } from '../contexts/ThemeContext';

function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [splits, setSplits] = useState([]);
    const [lastLapTime, setLastLapTime] = useState(0);
    const [pressedButton, setPressedButton] = useState(null);
    const { themeColor, setThemeColor } = useTheme();

    const startButtonRef = useRef(null);
    const resetButtonRef = useRef(null);
    const lapButtonRef = useRef(null);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);
    // NEW: refs to keep latest values of time and lastLapTime
    const timeRef = useRef(0);
    const lastLapTimeRef = useRef(lastLapTime);
    const lapCountRef = useRef(0);
    const splitsRef = useRef([]);


    // Keep refs updated
    useEffect(() => {
        timeRef.current = time;
    }, [time]);

    useEffect(() => {
        lastLapTimeRef.current = lastLapTime;
    }, [lastLapTime]);

    useEffect(() => {
        startButtonRef.current?.focus();
    }, []);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - time;
            intervalRef.current = setInterval(() => {
                const currentTime = Date.now() - startTimeRef.current;
                timeRef.current = currentTime;
                setTime(currentTime);
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
    }, [isRunning]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            switch (event.code) {
                case 'Space':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        setPressedButton('reset');
                        resetTimer();
                    } else if (document.activeElement === lapButtonRef.current) {
                        setPressedButton('lap');
                        lapTimer(); // uses ref-based logic now
                    } else if (document.activeElement === startButtonRef.current) {
                        setPressedButton('start');
                        isRunning ? stopTimer() : startTimer();
                    }
                    break;

                case 'ArrowLeft':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        startButtonRef.current.focus();
                    } else if (document.activeElement === startButtonRef.current) {
                        lapButtonRef.current.focus();
                    } else {
                        resetButtonRef.current.focus();
                    }
                    break;

                case 'ArrowRight':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        lapButtonRef.current.focus();
                    } else if (document.activeElement === lapButtonRef.current) {
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

    function startTimer() {
        setIsRunning(true);
        startTimeRef.current = Date.now() - time;

        if (splits.length === 0) {
            setLastLapTime(0);
        }
    }

    function resetTimer() {
        setIsRunning(false);
        setTime(0);
        setSplits([]);
        setLastLapTime(0);
        startTimeRef.current = 0;

        // Reset your refs tracking laps and time
        lastLapTimeRef.current = 0;
        lapCountRef.current = 0;

        // If you use a ref for the current stopwatch time, reset it too
        timeRef.current = 0;

        // Clear interval if needed (optional safety)
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }

    function stopTimer() {
        setIsRunning(false);
    }

    function lapTimer() {
        const currentTime = timeRef.current;
        const lapTime = currentTime - lastLapTimeRef.current;

        setSplits(prev => {
            const prevLap = prev[0]; // previous is at index 0 (most recent)
            const isLongerThanPrev = prevLap ? lapTime > prevLap.time : false;

            lapCountRef.current += 1;
            
            console.log(`Lap ${lapCountRef.current}: ${lapTime}ms, Previous: ${prevLap?.time}ms, isLongerThanPrev: ${isLongerThanPrev}`);

            const newLap = {
                lap: lapCountRef.current,
                time: lapTime,
                isLongerThanPrev,
            };

            const newSplits = [newLap, ...prev];

            splitsRef.current = newSplits;
            lastLapTimeRef.current = currentTime;

            return newSplits;
            
        });
    }




    function formatTime(time) {
        const totalSeconds = Math.floor(time / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    return (
        <div className='stopwatch-page'>
            <div className={`card ${themeColor}`}>
                <div className={styles.splits}>
                    {splits.map(({ lap, time, isLongerThanPrev }, index) => (
                        <div
                            key={index}
                            className={styles.split_item}
                            style={{
                                color: lap === 1
                                    ? 'white'
                                    : isLongerThanPrev
                                        ? '#ff6464'
                                        : '#5fa854',
                            }}
                        >
                            {`Lap ${lap}: ${formatTime(time)}`}
                        </div>
                    ))}
                </div>

                <div className={styles.stopwatch_display}>{formatTime(time)}</div>

                <div className="controls">
                    <button
                        ref={lapButtonRef}
                        onClick={lapTimer}
                        className={`small_button ${pressedButton === 'lap' ? 'space-pressed' : ''}`}
                    >
                        Lap
                    </button>
                    <button
                        ref={startButtonRef}
                        onClick={isRunning ? stopTimer : startTimer}
                        className={pressedButton === 'start' ? 'space-pressed' : ''}
                    >
                        {isRunning ? 'Stop' : 'Start'}
                    </button>
                    <button
                        ref={resetButtonRef}
                        onClick={resetTimer}
                        className={`small_button ${pressedButton === 'reset' ? 'space-pressed' : ''}`}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Stopwatch;
