import React, { useState, useEffect } from 'react';

const Timer = ({ isActive, onTimeUp }) => {
    const [time, setTime] = useState(600); // 10 minutes in seconds

    useEffect(() => {
        let interval = null;
        
        if (isActive && time > 0) {
            interval = setInterval(() => {
                setTime(time => {
                    if (time <= 1) {
                        clearInterval(interval);
                        onTimeUp();
                        return 0;
                    }
                    return time - 1;
                });
            }, 1000);
        } else if (!isActive) {
            clearInterval(interval);
        }
        
        return () => clearInterval(interval);
    }, [isActive, time, onTimeUp]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`timer ${isActive ? 'active' : ''}`}>
            {formatTime(time)}
        </div>
    );
};

export default Timer; 