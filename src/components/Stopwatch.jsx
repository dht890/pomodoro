import { useState, useEffect, useRef } from 'react';
import '../css/card.css'

function Stopwatch(){
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [pressedButton, setPressedButton] = useState(null);
    const startButtonRef = useRef(null);
    const resetButtonRef = useRef(null);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - time;
            intervalRef.current = setInterval(() => {
                const currentTime = Date.now() - startTimeRef.current;
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
            switch(event.code) {
                case 'Space':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
                        setPressedButton('reset');
                        resetTimer();
                    } else {
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
                    } else {
                        resetButtonRef.current.focus();
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if (document.activeElement === resetButtonRef.current) {
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

    function startTimer(){
        setIsRunning(true);
    }
    function resetTimer(){
        setIsRunning(false);
        setTime(0);
        startTimeRef.current = 0;
    }
    function stopTimer(){
        setIsRunning(false);
    }

    function formatTime(time){
        const totalSeconds = Math.floor(time / 1000);
        const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const milliseconds = String(Math.floor((time % 1000) / 10)).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}:${milliseconds}`;
    }

    return (
        <>
            <div className="card">
                <div className="display">{formatTime(time)}</div>
                <div className="controls">
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
                        className={`reset_button ${pressedButton === 'reset' ? 'space-pressed' : ''}`} 
                    >
                        Clear
                    </button>
                </div>
            </div>
        </>
    )
}

export default Stopwatch;