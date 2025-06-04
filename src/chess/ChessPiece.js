import React from "react";

const ChessPiece = ({type, color, onDragStart}) => {
    let piece;
    switch (type) {
        case "king":
            piece = color === "white" ? "\u2654" : "\u265A";
            break;
        case "queen":
            piece = color === "white" ? "\u2655" : "\u265B";
            break;
        case "rook":
            piece = color === "white" ? "\u2656" : "\u265C";
            break;
        case "bishop":
            piece = color === "white" ? "\u2657" : "\u265D";
            break;
        case "knight":
            piece = color === "white" ? "\u2658" : "\u265E";
            break;
        case "pawn":
            piece = color === "white" ? "\u2659" : "\u265F";
            break;
        default:
            piece = "";
            break;
    }

    return (
        <span 
            className="chess-piece"
            draggable
            onDragStart={onDragStart}
            onDragEnd={(e) => {
                e.target.classList.remove('dragging');
            }}
        >
            {piece}
        </span>
    );
};

export default ChessPiece;
