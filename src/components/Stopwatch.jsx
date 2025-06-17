import { useState, useEffect, useRef, use } from 'react';
import '../css/card.css'

function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [splits, setSplits] = useState([]);
    const [lastLapTime, setLastLapTime] = useState(0);
    const [pressedButton, setPressedButton] = useState(null);
    const startButtonRef = useRef(null);
    const resetButtonRef = useRef(null);
    const lapButtonRef = useRef(null);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        startButtonRef.current?.focus();
    }, []);

    useEffect(() => {
        if (isRunning) {
            //1. Calculate and store the start time
            startTimeRef.current = Date.now() - time;
            //2. Set up the interval to update the time
            intervalRef.current = setInterval(() => {
                //3. Calculate the current time
                const currentTime = Date.now() - startTimeRef.current;
                //4. Update the time state
                setTime(currentTime);
            }, 10);
            //5. Stop condition
        } else if (intervalRef.current) {
            //6. Clear the interval when the stopwatch is stopped
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        //7. Clean up the interval when the component unmounts
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
                        setPressedButton('lap')
                        lapTimer();
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
    }
    function stopTimer() {
        setIsRunning(false);
    }

    function lapTimer() {
        const lapTime = time - lastLapTime;
        const newLap = {
            lap: splits.length + 1,
            time: lapTime,
        };
        setSplits(prev => [newLap, ...prev]);
        setLastLapTime(time);
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
        <>
            <div className='stopwatch-page'>
                <div className="card">
                    <div className="splits">
                        {splits.map(({ lap, time }, index) => (
                            <div key={index} className="split-item">
                                {`Lap ${lap}: ${formatTime(time)}`}
                            </div>
                        ))}
                    </div>



                    <div className="stopwatch-display">{formatTime(time)}</div>
                    <div className="controls">
                        <button
                            ref={lapButtonRef}
                            onClick={lapTimer}
                            className={`small_button ${pressedButton === 'lap' ? 'space-pressed' : ''}`}>
                            Lap
                        </button>
                        <button
                            ref={startButtonRef}
                            onClick={isRunning ? stopTimer : startTimer}
                            className={pressedButton === 'start' ? 'space-pressed' : ''}
                        >
                            {isRunning ? "Stop" : "Start"}
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
        </>
    )
}

export default Stopwatch;