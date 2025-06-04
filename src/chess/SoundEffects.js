import React, { useEffect, useRef } from 'react';

const SoundEffects = () => {
    const moveSound = useRef(new Audio('/sounds/move.mp3'));
    const captureSound = useRef(new Audio('/sounds/capture.mp3'));

    useEffect(() => {
        // Preload sounds
        moveSound.current.load();
        captureSound.current.load();
    }, []);

    const playMoveSound = () => {
        moveSound.current.currentTime = 0;
        moveSound.current.play().catch(error => console.log('Error playing move sound:', error));
    };

    const playCaptureSound = () => {
        captureSound.current.currentTime = 0;
        captureSound.current.play().catch(error => console.log('Error playing capture sound:', error));
    };

    return { playMoveSound, playCaptureSound };
};

export default SoundEffects; 