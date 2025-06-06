import React, { useState, useEffect, useRef } from "react";
import RoyalChessPiece from "./RoyalChessPiece";
import {isMoveValid} from "./moveValidations";
import GameOverPopup from "./GameOverPopup";
import PromotionPopup from "./PromotionPopup";
import Timer from "./Timer";
import MoveList from "./MoveList";
import { isCheckmate } from "./checkmateDetection";
import { createMoveHistory, updateMoveHistory } from "./moveHistory";
import { getComputerMove } from "./computerPlayer";

const initialPieces = [
    // Black pieces
    { type: 'rook', color: 'black', i: 0, j: 0 },
    { type: 'knight', color: 'black', i: 0, j: 1 },
    { type: 'bishop', color: 'black', i: 0, j: 2 },
    { type: 'queen', color: 'black', i: 0, j: 3 },
    { type: 'king', color: 'black', i: 0, j: 4 },
    { type: 'bishop', color: 'black', i: 0, j: 5 },
    { type: 'knight', color: 'black', i: 0, j: 6 },
    { type: 'rook', color: 'black', i: 0, j: 7 },
    { type: 'pawn', color: 'black', i: 1, j: 0 },
    { type: 'pawn', color: 'black', i: 1, j: 1 },
    { type: 'pawn', color: 'black', i: 1, j: 2 },
    { type: 'pawn', color: 'black', i: 1, j: 3 },
    { type: 'pawn', color: 'black', i: 1, j: 4 },
    { type: 'pawn', color: 'black', i: 1, j: 5 },
    { type: 'pawn', color: 'black', i: 1, j: 6 },
    { type: 'pawn', color: 'black', i: 1, j: 7 },
    
    // White pieces
    { type: 'pawn', color: 'white', i: 6, j: 0 },
    { type: 'pawn', color: 'white', i: 6, j: 1 },
    { type: 'pawn', color: 'white', i: 6, j: 2 },
    { type: 'pawn', color: 'white', i: 6, j: 3 },
    { type: 'pawn', color: 'white', i: 6, j: 4 },
    { type: 'pawn', color: 'white', i: 6, j: 5 },
    { type: 'pawn', color: 'white', i: 6, j: 6 },
    { type: 'pawn', color: 'white', i: 6, j: 7 },
    { type: 'rook', color: 'white', i: 7, j: 0 },
    { type: 'knight', color: 'white', i: 7, j: 1 },
    { type: 'bishop', color: 'white', i: 7, j: 2 },
    { type: 'queen', color: 'white', i: 7, j: 3 },
    { type: 'king', color: 'white', i: 7, j: 4 },
    { type: 'bishop', color: 'white', i: 7, j: 5 },
    { type: 'knight', color: 'white', i: 7, j: 6 },
    { type: 'rook', color: 'white', i: 7, j: 7 }
];

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
    const [draggedPiece, setDraggedPiece] = useState(null);
    const [dragSource, setDragSource] = useState(null);
    const [turn, setTurn] = useState("white");
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState(null);
    const [capturedPieces, setCapturedPieces] = useState({ white: [], black: [] });
    const [promotionInfo, setPromotionInfo] = useState(null);
    const [moveHistory, setMoveHistory] = useState({ moves: [], enPassantTarget: null });
    const [castlingRights, setCastlingRights] = useState({
        white: { kingSide: true, queenSide: true },
        black: { kingSide: true, queenSide: true }
    });
    const [isReviewing, setIsReviewing] = useState(false);
    const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
    const moveSoundRef = useRef(new Audio('/sounds/move.mp3'));
    const captureSoundRef = useRef(new Audio('/sounds/capture.mp3'));

    // Piece values for evaluation
    const PIECE_VALUES = {
        pawn: 1,
        knight: 3,
        bishop: 3,
        rook: 5,
        queen: 9,
        king: 0
    };

    useEffect(() => {
        // Initialize audio elements
        const moveSound = new Audio();
        const captureSound = new Audio();
        
        moveSound.src = '/sounds/move.mp3';
        captureSound.src = '/sounds/capture.mp3';
        
        // Set audio properties
        moveSound.preload = 'auto';
        captureSound.preload = 'auto';
        
        // Store in refs
        moveSoundRef.current = moveSound;
        captureSoundRef.current = captureSound;
        
        // Load the sounds
        moveSound.load();
        captureSound.load();
        
        // Cleanup
        return () => {
            if (moveSoundRef.current) {
                moveSoundRef.current.pause();
                moveSoundRef.current = null;
            }
            if (captureSoundRef.current) {
                captureSoundRef.current.pause();
                captureSoundRef.current = null;
            }
        };
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (gameOver || promotionInfo) return;
            
            if (e.key === 'ArrowLeft') {
                handleMoveNavigation('back');
            } else if (e.key === 'ArrowRight') {
                handleMoveNavigation('forward');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [currentMoveIndex, gameOver, promotionInfo]);

    const handleMoveNavigation = (direction) => {
        if (!moveHistory.moves || moveHistory.moves.length === 0) return;
        
        let newIndex;
        if (direction === 'back') {
            newIndex = Math.max(0, currentMoveIndex - 1);
        } else {
            newIndex = Math.min(moveHistory.moves.length - 1, currentMoveIndex + 1);
        }
        
        if (newIndex === currentMoveIndex) return;
        
        // Reset the board to initial state
        const initialBoard = Array(8).fill(null).map((_, i) =>
            Array(8).fill(null).map((_, j) => {
                const piece = initialPieces.find(p => p.i === i && p.j === j);
                return piece ? { ...piece } : null;
            })
        );
        
        // Apply moves up to the selected index
        const newBoard = initialBoard.map(row => row.slice());
        const newCapturedPieces = { white: [], black: [] };
        const newCastlingRights = {
            white: { kingSide: true, queenSide: true },
            black: { kingSide: true, queenSide: true }
        };
        
        for (let i = 0; i <= newIndex; i++) {
            const move = moveHistory.moves[i];
            const { from, to, piece, captured, isCastling } = move;
            
            // Handle captures
            if (captured) {
                newCapturedPieces[piece.color].push(captured);
            }
            
            // Handle castling
            if (isCastling) {
                const isKingSide = to.j > from.j;
                const rookCol = isKingSide ? 7 : 0;
                const newRookCol = isKingSide ? to.j - 1 : to.j + 1;
                
                // Move the rook
                newBoard[to.i][newRookCol] = newBoard[from.i][rookCol];
                newBoard[from.i][rookCol] = null;
                
                // Update castling rights
                newCastlingRights[piece.color] = { kingSide: false, queenSide: false };
            }
            
            // Move the piece
            newBoard[to.i][to.j] = piece;
            newBoard[from.i][from.j] = null;
            
            // Update castling rights for king and rook moves
            if (piece.type === 'king') {
                newCastlingRights[piece.color] = { kingSide: false, queenSide: false };
            } else if (piece.type === 'rook') {
                const isKingSide = from.j === 7;
                newCastlingRights[piece.color][isKingSide ? 'kingSide' : 'queenSide'] = false;
            }
        }
        
        setBoard(newBoard);
        setCapturedPieces(newCapturedPieces);
        setCastlingRights(newCastlingRights);
        setCurrentMoveIndex(newIndex);
        setTurn(newIndex % 2 === 0 ? 'white' : 'black');
    };

    // Calculate win percentages based on material and position
    const calculateWinPercentage = () => {
        let whiteScore = 0;
        let blackScore = 0;

        // Count captured pieces
        capturedPieces.white.forEach(piece => {
            whiteScore += PIECE_VALUES[piece.type];
        });
        capturedPieces.black.forEach(piece => {
            blackScore += PIECE_VALUES[piece.type];
        });

        // Count remaining pieces on board
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece) {
                    const value = PIECE_VALUES[piece.type];
                    if (piece.color === 'white') {
                        whiteScore += value;
                    } else {
                        blackScore += value;
                    }
                }
            }
        }

        const totalScore = whiteScore + blackScore;
        if (totalScore === 0) return { white: 50, black: 50 };

        const whitePercentage = Math.round((whiteScore / totalScore) * 100);
        return {
            white: whitePercentage,
            black: 100 - whitePercentage
        };
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
        setCapturedPieces({ white: [], black: [] });
        setCastlingRights({
            white: { kingSide: true, queenSide: true },
            black: { kingSide: true, queenSide: true }
        });
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

    const canPieceAttackSquare = (piece, source, target, board) => {
        if (!piece) return false;

        // Check if target is within board bounds
        if (target.i < 0 || target.i > 7 || target.j < 0 || target.j > 7) return false;

        // Check if target square is occupied by same color piece
        if (board[target.i][target.j] && board[target.i][target.j].color === piece.color) return false;

        // Check if the piece can attack the square based on its type
        switch (piece.type) {
            case 'pawn':
                const direction = piece.color === 'white' ? -1 : 1;
                return Math.abs(target.j - source.j) === 1 && target.i === source.i + direction;
            case 'rook':
                return isValidRookMove(piece, source, target, board);
            case 'knight':
                return isValidKnightMove(piece, source, target, board);
            case 'bishop':
                return isValidBishopMove(piece, source, target, board);
            case 'queen':
                return isValidQueenMove(piece, source, target, board);
            case 'king':
                const rowDiff = Math.abs(target.i - source.i);
                const colDiff = Math.abs(target.j - source.j);
                return rowDiff <= 1 && colDiff <= 1;
            default:
                return false;
        }
    };

    const isSquareUnderAttack = (square, attackingColor, board) => {
        // Check if any piece of the attacking color can attack this square
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.color === attackingColor) {
                    if (canPieceAttackSquare(piece, { i, j }, square, board)) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    const isKingInCheck = (color, board) => {
        // Find the king's position
        let kingPosition = null;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.type === 'king' && piece.color === color) {
                    kingPosition = { i, j };
                    break;
                }
            }
            if (kingPosition) break;
        }

        if (!kingPosition) return true; // King is captured, game over

        // Check if any opponent piece can attack the king
        const opponentColor = color === 'white' ? 'black' : 'white';
        return isSquareUnderAttack(kingPosition, opponentColor, board);
    };

    const isValidPawnMove = (piece, source, target, board, moveHistory) => {
        const direction = piece.color === 'white' ? -1 : 1;
        const startRow = piece.color === 'white' ? 6 : 1;
        
        // Forward move
        if (target.j === source.j && !board[target.i][target.j]) {
            // Single square move
            if (target.i === source.i + direction) {
                return true;
            }
            // Double square move from starting position
            if (source.i === startRow && target.i === source.i + 2 * direction && !board[source.i + direction][source.j]) {
                return true;
            }
        }
        
        // Capture moves
        if (Math.abs(target.j - source.j) === 1 && target.i === source.i + direction) {
            // Regular capture
            if (board[target.i][target.j] && board[target.i][target.j].color !== piece.color) {
                return true;
            }
            // En passant capture
            if (moveHistory.enPassantTarget && 
                target.i === moveHistory.enPassantTarget.i && 
                target.j === moveHistory.enPassantTarget.j) {
                return true;
            }
        }
        
        return false;
    };

    const isValidRookMove = (piece, source, target, board) => {
        // Rook moves horizontally or vertically
        if (source.i !== target.i && source.j !== target.j) return false;
        
        // Check if path is clear
        if (source.i === target.i) {
            // Horizontal move
            const direction = target.j > source.j ? 1 : -1;
            for (let j = source.j + direction; j !== target.j; j += direction) {
                if (board[source.i][j]) return false;
            }
        } else {
            // Vertical move
            const direction = target.i > source.i ? 1 : -1;
            for (let i = source.i + direction; i !== target.i; i += direction) {
                if (board[i][source.j]) return false;
            }
        }
        
        return true;
    };

    const isValidKnightMove = (piece, source, target, board) => {
        const rowDiff = Math.abs(target.i - source.i);
        const colDiff = Math.abs(target.j - source.j);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    };

    const isValidBishopMove = (piece, source, target, board) => {
        // Bishop moves diagonally
        if (Math.abs(target.i - source.i) !== Math.abs(target.j - source.j)) return false;
        
        // Check if path is clear
        const rowDirection = target.i > source.i ? 1 : -1;
        const colDirection = target.j > source.j ? 1 : -1;
        
        let i = source.i + rowDirection;
        let j = source.j + colDirection;
        
        while (i !== target.i && j !== target.j) {
            if (board[i][j]) return false;
            i += rowDirection;
            j += colDirection;
        }
        
        return true;
    };

    const isValidQueenMove = (piece, source, target, board) => {
        // Queen moves like a rook or bishop
        return isValidRookMove(piece, source, target, board) || 
               isValidBishopMove(piece, source, target, board);
    };

    const isValidKingMove = (piece, source, target, board) => {
        const rowDiff = Math.abs(target.i - source.i);
        const colDiff = Math.abs(target.j - source.j);
        
        // Check for castling
        if (rowDiff === 0 && colDiff === 2) {
            const isKingSide = target.j > source.j;
            const rookCol = isKingSide ? 7 : 0;
            const rook = board[source.i][rookCol];
            
            // Check if castling is allowed
            if (!castlingRights[piece.color][isKingSide ? 'kingSide' : 'queenSide']) {
                return false;
            }

            // Check if king and rook haven't moved
            if (!rook || rook.type !== 'rook' || rook.color !== piece.color) {
                return false;
            }

            // Check if rook has moved by looking at move history
            const rookHasMoved = moveHistory.moves?.some(move => 
                move.piece.type === 'rook' && 
                move.piece.color === piece.color && 
                move.from.j === rookCol
            );
            if (rookHasMoved) {
                return false;
            }

            // Check if path is clear
            const direction = isKingSide ? 1 : -1;
            for (let j = source.j + direction; j !== rookCol; j += direction) {
                if (board[source.i][j]) {
                    return false;
                }
            }

            // Check if king is in check or would pass through check
            for (let j = source.j; j !== target.j + direction; j += direction) {
                if (isSquareUnderAttack({ i: source.i, j }, piece.color === 'white' ? 'black' : 'white', board)) {
                    return false;
                }
            }

            return true;
        }
        
        // Regular king move
        return rowDiff <= 1 && colDiff <= 1;
    };

    const isCheckmate = (board, color) => {
        // First check if the king is in check
        if (!isKingInCheck(color, board)) {
            return false;
        }

        // Try all possible moves for all pieces of the given color
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = board[i][j];
                if (piece && piece.color === color) {
                    // Try all possible moves for this piece
                    for (let targetI = 0; targetI < 8; targetI++) {
                        for (let targetJ = 0; targetJ < 8; targetJ++) {
                            if (isMoveValid(piece, { i, j }, { i: targetI, j: targetJ }, board, moveHistory)) {
                                // If any valid move is found, it's not checkmate
                                return false;
                            }
                        }
                    }
                }
            }
        }

        // If no valid moves are found, it's checkmate
        return true;
    };

    const isMoveValid = (piece, source, target, board, moveHistory) => {
        if (!piece || !source || !target) return false;
        
        // Check if target is within board bounds
        if (target.i < 0 || target.i > 7 || target.j < 0 || target.j > 7) return false;
        
        // Check if target square is occupied by same color piece
        if (board[target.i][target.j] && board[target.i][target.j].color === piece.color) return false;

        // Create a temporary board to check if the move gets the king out of check
        const tempBoard = board.map(row => row.slice());
        tempBoard[target.i][target.j] = piece;
        tempBoard[source.i][source.j] = null;

        // If king is in check, only allow moves that get the king out of check
        if (isKingInCheck(piece.color, board)) {
            // Check if the move is valid for the piece type
            let isValidPieceMove = false;
            switch (piece.type) {
                case 'pawn':
                    isValidPieceMove = isValidPawnMove(piece, source, target, board, moveHistory);
                    break;
                case 'rook':
                    isValidPieceMove = isValidRookMove(piece, source, target, board);
                    break;
                case 'knight':
                    isValidPieceMove = isValidKnightMove(piece, source, target, board);
                    break;
                case 'bishop':
                    isValidPieceMove = isValidBishopMove(piece, source, target, board);
                    break;
                case 'queen':
                    isValidPieceMove = isValidQueenMove(piece, source, target, board);
                    break;
                case 'king':
                    isValidPieceMove = isValidKingMove(piece, source, target, board);
                    break;
                default:
                    return false;
            }

            // If the move is valid for the piece, check if it gets the king out of check
            if (isValidPieceMove && !isKingInCheck(piece.color, tempBoard)) {
                return true;
            }
            return false;
        }

        // If king is not in check, check if the move would put the king in check
        if (isKingInCheck(piece.color, tempBoard)) {
            return false;
        }

        // Check if the move is valid for the piece type
        switch (piece.type) {
            case 'pawn':
                return isValidPawnMove(piece, source, target, board, moveHistory);
            case 'rook':
                return isValidRookMove(piece, source, target, board);
            case 'knight':
                return isValidKnightMove(piece, source, target, board);
            case 'bishop':
                return isValidBishopMove(piece, source, target, board);
            case 'queen':
                return isValidQueenMove(piece, source, target, board);
            case 'king':
                return isValidKingMove(piece, source, target, board);
            default:
                return false;
        }
    };

    const testSound = () => {
        console.log("Testing sound...");
        const audio = new Audio('/sounds/move.mp3');
        audio.play().then(() => {
            console.log("Sound played successfully");
        }).catch(error => {
            console.error("Error playing sound:", error);
        });
    };

    const playMoveSound = () => {
        console.log("Playing move sound...");
        const audio = new Audio('/sounds/move.mp3');
        audio.play().catch(error => {
            console.error("Error playing move sound:", error);
        });
    };

    const playCaptureSound = () => {
        console.log("Playing capture sound...");
        const audio = new Audio('/sounds/capture.mp3');
        audio.play().catch(error => {
            console.error("Error playing capture sound:", error);
        });
    };

    const handleDrop = (e, i, j) => {
        e.preventDefault();
        if (!draggedPiece || !dragSource || gameOver || promotionInfo || isReviewing) return;

        if (isMoveValid(draggedPiece, dragSource, {i, j}, board, moveHistory)) {
            const newBoard = board.map((row) => row.slice());
            newBoard[dragSource.i][dragSource.j] = null;
            
            // Handle captures
            if (newBoard[i][j]) {
                const capturedPiece = newBoard[i][j];
                // Check if king is captured
                if (capturedPiece.type === 'king') {
                    setGameOver(true);
                    setWinner(draggedPiece.color);
                    setCapturedPieces(prev => ({
                        ...prev,
                        [draggedPiece.color]: [...prev[draggedPiece.color], capturedPiece]
                    }));
                    playCaptureSound();
                    newBoard[i][j] = draggedPiece;
                    setBoard(newBoard);
                    return;
                }
                setCapturedPieces(prev => ({
                    ...prev,
                    [draggedPiece.color]: [...prev[draggedPiece.color], capturedPiece]
                }));
                playCaptureSound();
            } else {
                console.log("Regular move - should play move sound");
                playMoveSound();
            }
            
            // Handle castling
            if (draggedPiece.type === 'king' && Math.abs(j - dragSource.j) === 2) {
                const isKingSide = j > dragSource.j;
                const rookCol = isKingSide ? 7 : 0;
                const newRookCol = isKingSide ? j - 1 : j + 1;
                
                // Move the rook
                newBoard[i][newRookCol] = newBoard[i][rookCol];
                newBoard[i][rookCol] = null;
                console.log("Castling move - should play move sound");
                playMoveSound();
            }
            
            // Handle en passant capture
            if (draggedPiece.type === 'pawn' && 
                Math.abs(j - dragSource.j) === 1 && 
                !newBoard[i][j] && 
                moveHistory.enPassantTarget?.i === i && 
                moveHistory.enPassantTarget?.j === j) {
                const capturedPawnRow = dragSource.i;
                const capturedPawn = newBoard[capturedPawnRow][j];
                newBoard[capturedPawnRow][j] = null;
                setCapturedPieces(prev => ({
                    ...prev,
                    [draggedPiece.color]: [...prev[draggedPiece.color], capturedPawn]
                }));
                playCaptureSound();
            }
            
            newBoard[i][j] = draggedPiece;
            setBoard(newBoard);
            
            // Update castling rights
            if (draggedPiece.type === 'king') {
                setCastlingRights(prev => ({
                    ...prev,
                    [draggedPiece.color]: { kingSide: false, queenSide: false }
                }));
            } else if (draggedPiece.type === 'rook') {
                const isKingSide = dragSource.j === 7;
                setCastlingRights(prev => ({
                    ...prev,
                    [draggedPiece.color]: {
                        ...prev[draggedPiece.color],
                        [isKingSide ? 'kingSide' : 'queenSide']: false
                    }
                }));
            }
            
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
                    captured: board[i][j],
                    isCastling: draggedPiece.type === 'king' && Math.abs(j - dragSource.j) === 2
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
            <div className="side-panel black">
                <div className="win-percentages">
                    <div className="win-percentage black">
                        <span>Black: {calculateWinPercentage().black}%</span>
                    </div>
                </div>
                <div className="captured-pieces">
                    <div className="captured-pieces-section black">
                        <h3>Captured by Black</h3>
                        <div className="captured-pieces-list">
                            {capturedPieces.black.map((piece, index) => (
                                <div key={`black-${index}`} className="captured-piece">
                                    <RoyalChessPiece type={piece.type} color={piece.color} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="board-container">
                <div className="timer-container" style={{ display: 'none' }}>
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

            <div className="side-panel white">
                <div className="win-percentages">
                    <div className="win-percentage white">
                        <span>White: {calculateWinPercentage().white}%</span>
                    </div>
                </div>
                <div className="captured-pieces">
                    <div className="captured-pieces-section white">
                        <h3>Captured by White</h3>
                        <div className="captured-pieces-list">
                            {capturedPieces.white.map((piece, index) => (
                                <div key={`white-${index}`} className="captured-piece">
                                    <RoyalChessPiece type={piece.type} color={piece.color} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

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
