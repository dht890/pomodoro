import { useState, useEffect, useRef } from 'react';
import '../css/card.css'

function Card(){
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
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

    function startTimer(){
        setIsRunning(true);
    }
    function resetTimer(){
        setIsRunning(false);
        setTime(0);
    }
    function stopTimer(){
        setIsRunning(false);
    }

    function formatTime(time: number){
        const hours = String(Math.floor(time / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
        const seconds = String(time % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
    return (
        <>
            <div className="card">
                <div className="display">{formatTime(time)}</div>
                <div className="controls">
                    <button onClick={isRunning ? stopTimer : startTimer}>
                        {isRunning ? "Stop" : "Start"}
                    </button>
                    <button onClick={resetTimer} className='reset_button' disabled={time === 0 && !isRunning}>
                        Reset
                    </button>
                </div>
            </div>
        </>
    )
}

export default Card;