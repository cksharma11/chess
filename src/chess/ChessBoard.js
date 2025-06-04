import React, {useState, useEffect} from "react";
import RoyalChessPiece from "./RoyalChessPiece";
import {isMoveValid} from "./moveValidations";
import SoundEffects from "./SoundEffects";
import GameOverPopup from "./GameOverPopup";
import PromotionPopup from "./PromotionPopup";
import { isCheckmate } from "./checkmateDetection";
import { createMoveHistory, updateMoveHistory } from "./moveHistory";
import { getComputerMove } from "./computerPlayer";
import Timer from "./Timer";
import MoveList from "./MoveList";

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
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [moveHistory, setMoveHistory] = useState({ moves: [], enPassantTarget: null });
    const [promotionInfo, setPromotionInfo] = useState(null);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
    const [isReviewing, setIsReviewing] = useState(false);
    const { playMoveSound, playCaptureSound } = SoundEffects();

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameOver || promotionInfo) return;
            
            if (e.key === 'ArrowLeft') {
                handleMoveSelect(currentMoveIndex - 1);
            } else if (e.key === 'ArrowRight') {
                handleMoveSelect(currentMoveIndex + 1);
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentMoveIndex, gameOver, promotionInfo]);

    const handleMoveSelect = (index) => {
        const moves = moveHistory?.moves || [];
        if (index < -1 || index >= moves.length) return;
        
        setCurrentMoveIndex(index);
        setIsReviewing(index !== moves.length - 1);
        
        if (index === -1) {
            setBoard(initialBoardSetup());
            setTurn("white");
        } else {
            const newBoard = initialBoardSetup();
            for (let i = 0; i <= index; i++) {
                const move = moves[i];
                if (move) {
                    newBoard[move.to.i][move.to.j] = move.piece;
                    newBoard[move.from.i][move.from.j] = null;
                }
            }
            setBoard(newBoard);
            setTurn(index % 2 === 0 ? "white" : "black");
        }
    };

    const handleTimeUp = (color) => {
        setGameOver(true);
        setWinner(color === 'white' ? 'black' : 'white');
    };

    // Handle computer's move
    useEffect(() => {
        if (turn === 'black' && !gameOver && !promotionInfo) {
            const timer = setTimeout(() => {
                const computerMove = getComputerMove(board);
                if (computerMove) {
                    const { from, to, piece } = computerMove;
                    const newBoard = board.map(row => row.slice());
                    newBoard[from.i][from.j] = null;
                    
                    // Handle captures
                    if (newBoard[to.i][to.j]) {
                        playCaptureSound();
                    } else {
                        playMoveSound();
                    }
                    
                    newBoard[to.i][to.j] = piece;
                    setBoard(newBoard);
                    
                    // Check for pawn promotion
                    if (piece.type === 'pawn' && to.i === 0) {
                        setPromotionInfo({ i: to.i, j: to.j, color: piece.color });
                    } else {
                        // Update move history
                        setMoveHistory(updateMoveHistory(moveHistory, from, to, piece, newBoard));
                        
                        // Check for checkmate
                        if (isCheckmate(newBoard, 'white')) {
                            setGameOver(true);
                            setWinner('black');
                        } else {
                            setTurn('white');
                        }
                    }
                }
            }, 500); // Add a small delay for better UX
            
            return () => clearTimeout(timer);
        }
    }, [turn, board, gameOver, promotionInfo]);

    const handleNewGame = () => {
        setBoard(initialBoardSetup());
        setTurn("white");
        setGameOver(false);
        setWinner(null);
        setMoveHistory({ moves: [], enPassantTarget: null });
        setPromotionInfo(null);
        setCurrentMoveIndex(-1);
        setIsReviewing(false);
    };

    const handlePromotion = (pieceType) => {
        if (!promotionInfo) return;

        const { i, j, color } = promotionInfo;
        const newBoard = board.map(row => row.slice());
        newBoard[i][j] = { type: pieceType, color };
        setBoard(newBoard);
        setPromotionInfo(null);

        // Update move history
        const updatedHistory = {
            moves: [...(moveHistory.moves || []), {
                from: dragSource,
                to: { i, j },
                piece: { type: pieceType, color },
                captured: null
            }],
            enPassantTarget: null
        };
        setMoveHistory(updatedHistory);
        setCurrentMoveIndex(updatedHistory.moves.length - 1);

        // Check for checkmate after promotion
        const nextTurn = turn === "white" ? "black" : "white";
        if (isCheckmate(newBoard, nextTurn)) {
            setGameOver(true);
            setWinner(turn);
        } else {
            setTurn(nextTurn);
        }
    };

    const handleDragStart = (e, piece, i, j) => {
        if (piece.color !== turn || gameOver || promotionInfo) {
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
        if (!draggedPiece || !dragSource || gameOver || promotionInfo || isReviewing) return;

        if (isMoveValid(draggedPiece, dragSource, {i, j}, board, moveHistory)) {
            const newBoard = board.map((row) => row.slice());
            newBoard[dragSource.i][dragSource.j] = null;
            
            // Handle en passant capture
            if (draggedPiece.type === 'pawn' && 
                Math.abs(j - dragSource.j) === 1 && 
                !newBoard[i][j] && 
                moveHistory.enPassantTarget?.i === i && 
                moveHistory.enPassantTarget?.j === j) {
                const capturedPawnRow = dragSource.i;
                newBoard[capturedPawnRow][j] = null;
                playCaptureSound();
            } else if (newBoard[i][j]) {
                playCaptureSound();
            } else {
                playMoveSound();
            }
            
            newBoard[i][j] = draggedPiece;
            setBoard(newBoard);
            
            // Check for pawn promotion
            if (draggedPiece.type === 'pawn' && (i === 0 || i === 7)) {
                setPromotionInfo({ i, j, color: draggedPiece.color });
                return;
            }
            
            // Set en passant target for next move
            let enPassantTarget = null;
            if (draggedPiece.type === 'pawn' && Math.abs(i - dragSource.i) === 2) {
                enPassantTarget = {
                    i: (i + dragSource.i) / 2,
                    j: j
                };
            }
            
            // Update move history
            const updatedHistory = {
                moves: [...(moveHistory.moves || []), {
                    from: dragSource,
                    to: { i, j },
                    piece: draggedPiece,
                    captured: board[i][j]
                }],
                enPassantTarget
            };
            setMoveHistory(updatedHistory);
            setCurrentMoveIndex(updatedHistory.moves.length - 1);
            
            // Check for checkmate after the move
            const nextTurn = turn === "white" ? "black" : "white";
            if (isCheckmate(newBoard, nextTurn)) {
                setGameOver(true);
                setWinner(turn);
            } else {
                setTurn(nextTurn);
            }
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
                    <RoyalChessPiece 
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
        <div className="chess-board-container">
            <div>
                <div className="timer-container">
                    <div>
                        <div className="timer-label">White</div>
                        <Timer isActive={turn === 'white' && !gameOver} onTimeUp={() => handleTimeUp('white')} />
                    </div>
                    <div>
                        <div className="timer-label">Black</div>
                        <Timer isActive={turn === 'black' && !gameOver} onTimeUp={() => handleTimeUp('black')} />
                    </div>
                </div>
                <div 
                    className="chess-board"
                    onDragEnd={handleDragEnd}
                >
                    {squares}
                </div>
            </div>
            <MoveList 
                moves={moveHistory?.moves || []}
                currentMoveIndex={currentMoveIndex}
                onMoveSelect={handleMoveSelect}
            />
            {gameOver && (
                <GameOverPopup 
                    winner={winner} 
                    onNewGame={handleNewGame}
                />
            )}
            {promotionInfo && (
                <PromotionPopup 
                    color={promotionInfo.color}
                    onSelect={handlePromotion}
                />
            )}
        </div>
    );
};

export default ChessBoard;
