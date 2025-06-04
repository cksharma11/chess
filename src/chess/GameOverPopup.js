import React from 'react';

const GameOverPopup = ({ winner, onNewGame }) => {
    return (
        <div className="game-over-overlay">
            <div className="game-over-popup">
                <h2>Game Over!</h2>
                <p>{winner === 'white' ? 'White' : 'Black'} wins by checkmate!</p>
                <button onClick={onNewGame}>New Game</button>
            </div>
        </div>
    );
};

export default GameOverPopup; 