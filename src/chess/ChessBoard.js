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
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [turn, setTurn] = useState("white");

    const handleSquareClick = (i, j) => {
        if (selectedPiece) {
            const {piece, from} = selectedPiece;
            if (piece.color !== turn) {
                setSelectedPiece(null);
                return;
            }
            if (isMoveValid(piece, from, {i, j}, board)) {
                const newBoard = board.map((row) => row.slice());
                newBoard[from.i][from.j] = null;
                newBoard[i][j] = piece;
                setBoard(newBoard);
                setTurn(turn === "white" ? "black" : "white");
            }
            setSelectedPiece(null);
        } else if (board[i][j] && board[i][j].color === turn) {
            setSelectedPiece({piece: board[i][j], from: {i, j}});
        }
    };

    const renderSquare = (i, j) => {
        const piece = board[i][j];
        const isBlack = (i + j) % 2 === 1;
        return (
            <div
                key={`${i}-${j}`}
                className={`square ${isBlack ? "black" : "white"}`}
                onClick={() => handleSquareClick(i, j)}
            >
                {piece && <ChessPiece type={piece.type} color={piece.color}/>}
            </div>
        );
    };

    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            squares.push(renderSquare(i, j));
        }
    }

    return <div className="chess-board">{squares}</div>;
};

export default ChessBoard;
