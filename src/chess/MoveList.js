import React from 'react';

const MoveList = ({ moves = [], currentMoveIndex = -1, onMoveSelect }) => {
    const formatMove = (move) => {
        const { from, to, piece, captured } = move;
        const fromSquare = `${String.fromCharCode(97 + from.j)}${8 - from.i}`;
        const toSquare = `${String.fromCharCode(97 + to.j)}${8 - to.i}`;
        const pieceSymbol = piece.type.charAt(0).toUpperCase();
        const captureSymbol = captured ? 'x' : '';
        return `${pieceSymbol}${captureSymbol}${toSquare}`;
    };

    if (!moves || moves.length === 0) {
        return (
            <div className="move-list">
                <h3>Move History</h3>
                <div className="moves">
                    <div className="move empty">No moves yet</div>
                </div>
                <div className="move-navigation">
                    <button disabled>← Previous</button>
                    <button disabled>Next →</button>
                </div>
            </div>
        );
    }

    return (
        <div className="move-list">
            <h3>Move History</h3>
            <div className="moves">
                {moves.map((move, index) => (
                    <div
                        key={index}
                        className={`move ${index === currentMoveIndex ? 'current' : ''}`}
                        onClick={() => onMoveSelect(index)}
                    >
                        {formatMove(move)}
                    </div>
                ))}
            </div>
            <div className="move-navigation">
                <button 
                    onClick={() => onMoveSelect(currentMoveIndex - 1)}
                    disabled={currentMoveIndex <= 0}
                >
                    ← Previous
                </button>
                <button 
                    onClick={() => onMoveSelect(currentMoveIndex + 1)}
                    disabled={currentMoveIndex >= moves.length - 1}
                >
                    Next →
                </button>
            </div>
        </div>
    );
};

export default MoveList; 