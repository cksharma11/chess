import React from "react";

const RoyalChessPiece = ({ type, color, onDragStart }) => {
    const pieceColor = color === "white" ? "#FFFFFF" : "#000000";
    const strokeColor = color === "white" ? "#000000" : "#FFFFFF";
    const shadowColor = color === "white" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)";

    const handleDragStart = (e) => {
        e.dataTransfer.effectAllowed = 'move';
        onDragStart(e, { type, color });
        e.target.classList.add('dragging');
    };

    const handleDragEnd = (e) => {
        e.target.classList.remove('dragging');
    };

    const getPieceSVG = () => {
        switch (type) {
            case "king":
                return (
                    <svg viewBox="0 0 45 45" width="100%" height="100%">
                        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22.5 11.63V6M20 8h5" strokeWidth="2"/>
                            <path d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
                            <path d="M11.5 37c17.5 3.5 27.5 3.5 45 0v-7s-9.5 3-22.5-3c-13 6-22.5 3-22.5 3v7z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5"/>
                            <path d="M11.5 30c17.5-3 27.5-3 45 0m-45 3.5c17.5 3 27.5 3 45 0m-45 3.5c17.5 3 27.5 3 45 0" stroke={strokeColor} strokeWidth="1.5"/>
                            <path d="M20 8h5" strokeWidth="2"/>
                            <path d="M22.5 6v5" strokeWidth="2"/>
                            <path d="M20 8c0-2 2-3 2.5-3s2.5 1 2.5 3" strokeWidth="2"/>
                            <path d="M22.5 11.63c-1.5 0-3-1.5-3-3.13 0-1.5 1.5-3 3-3s3 1.5 3 3.13c0 1.63-1.5 3.13-3 3.13z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5"/>
                            <path d="M22.5 8.5v3" strokeWidth="2"/>
                            <path d="M20 8.5h5" strokeWidth="2"/>
                        </g>
                    </svg>
                );
            case "queen":
                return (
                    <svg viewBox="0 0 45 45" width="100%" height="100%">
                        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM24.5 7.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM41 12a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM16 8.5a2 2 0 1 1-4 0 2 2 0 1 1 4 0zM33 9a2 2 0 1 1-4 0 2 2 0 1 1 4 0z"/>
                            <path d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z" strokeLinecap="butt"/>
                            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-4 2.5-4" strokeLinecap="butt"/>
                            <path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" fill="none"/>
                        </g>
                    </svg>
                );
            case "rook":
                return (
                    <svg viewBox="0 0 45 45" width="100%" height="100%">
                        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5" strokeLinecap="butt"/>
                            <path d="M34 14l-3 3H14l-3-3"/>
                            <path d="M31 17v12.5H14V17" strokeLinecap="butt" strokeLinejoin="miter"/>
                            <path d="M31 29.5l1.5 2.5h-20l1.5-2.5"/>
                            <path d="M11 14h23" fill="none" stroke={strokeColor} strokeWidth="1" strokeLinejoin="miter"/>
                        </g>
                    </svg>
                );
            case "bishop":
                return (
                    <svg viewBox="0 0 45 45" width="100%" height="100%">
                        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z"/>
                                <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z"/>
                                <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z"/>
                            </g>
                        </g>
                    </svg>
                );
            case "knight":
                return (
                    <svg viewBox="0 0 45 45" width="100%" height="100%">
                        <g fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"/>
                            <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"/>
                        </g>
                    </svg>
                );
            case "pawn":
                return (
                    <svg viewBox="0 0 45 45" width="100%" height="100%">
                        <path d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z" fill={pieceColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <div 
            className="royal-chess-piece"
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
                filter: `drop-shadow(2px 2px 2px ${shadowColor})`,
                width: '85%',
                height: '85%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            {getPieceSVG()}
        </div>
    );
};

export default RoyalChessPiece; 