import React, {useState} from "react";
import ChessPiece from "./ChessPiece";
import {isMoveValid} from "./moveValidations";

const initialBoardSetup = () => {
    const board = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
    for (let i = 0; i < 8; i++) {
        board[1][i] = {type: "pawn", color: "black"};
        board[6][i] = {type: "pawn", color: "white"};
    }
    board[0][0] = board[0][7] = {type: "rook", color: "black"};
    board[0][1] = board[0][6] = {type: "knight", color: "black"};
    board[0][2] = board[0][5] = {type: "bishop", color: "black"};
    board[0][3] = {type: "queen", color: "black"};
    board[0][4] = {type: "king", color: "black"};

    board[7][0] = board[7][7] = {type: "rook", color: "white"};
    board[7][1] = board[7][6] = {type: "knight", color: "white"};
    board[7][2] = board[7][5] = {type: "bishop", color: "white"};
    board[7][3] = {type: "queen", color: "white"};
    board[7][4] = {type: "king", color: "white"};

    return board;
};

const ChessBoard = () => {
    const [board, setBoard] = useState(initialBoardSetup());
    const [turn, setTurn] = useState("white");
    const [draggedPiece, setDraggedPiece] = useState(null);
    const [dragSource, setDragSource] = useState(null);

    const handleDragStart = (e, piece, i, j) => {
        if (piece.color !== turn) {
            e.preventDefault();
            return;
        }
        setDraggedPiece(piece);
        setDragSource({i, j});
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, i, j) => {
        e.preventDefault();
        if (!draggedPiece || !dragSource) return;

        if (isMoveValid(draggedPiece, dragSource, {i, j}, board)) {
            const newBoard = board.map((row) => row.slice());
            newBoard[dragSource.i][dragSource.j] = null;
            newBoard[i][j] = draggedPiece;
            setBoard(newBoard);
            setTurn(turn === "white" ? "black" : "white");
        }
        setDraggedPiece(null);
        setDragSource(null);
    };

    const handleDragEnd = () => {
        setDraggedPiece(null);
        setDragSource(null);
    };

    const renderSquare = (i, j) => {
        const piece = board[i][j];
        const isBlack = (i + j) % 2 === 1;
        const coord = j === 0 ? 8 - i : (i === 7 ? String.fromCharCode(97 + j) : '');
        
        return (
            <div
                key={`${i}-${j}`}
                className={`square ${isBlack ? "black" : "white"}`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, i, j)}
                data-coord={coord}
            >
                {piece && (
                    <ChessPiece 
                        type={piece.type} 
                        color={piece.color}
                        onDragStart={(e) => handleDragStart(e, piece, i, j)}
                    />
                )}
            </div>
        );
    };

    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            squares.push(renderSquare(i, j));
        }
    }

    return (
        <div 
            className="chess-board"
            onDragEnd={handleDragEnd}
        >
            {squares}
        </div>
    );
};

export default ChessBoard;
