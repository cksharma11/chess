import { isMoveValid } from './moveValidations';
import { isKingInCheck } from './checkmateDetection';

// Piece values for evaluation
const PIECE_VALUES = {
    pawn: 100,
    knight: 320,
    bishop: 330,
    rook: 500,
    queen: 900,
    king: 20000
};

// Position tables for piece-square evaluation
const PAWN_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [50, 50, 50, 50, 50, 50, 50, 50],
    [10, 10, 20, 30, 30, 20, 10, 10],
    [5,  5, 10, 25, 25, 10,  5,  5],
    [0,  0,  0, 20, 20,  0,  0,  0],
    [5, -5,-10,  0,  0,-10, -5,  5],
    [5, 10, 10,-20,-20, 10, 10,  5],
    [0,  0,  0,  0,  0,  0,  0,  0]
];

const KNIGHT_TABLE = [
    [-50,-40,-30,-30,-30,-30,-40,-50],
    [-40,-20,  0,  0,  0,  0,-20,-40],
    [-30,  0, 10, 15, 15, 10,  0,-30],
    [-30,  5, 15, 20, 20, 15,  5,-30],
    [-30,  0, 15, 20, 20, 15,  0,-30],
    [-30,  5, 10, 15, 15, 10,  5,-30],
    [-40,-20,  0,  5,  5,  0,-20,-40],
    [-50,-40,-30,-30,-30,-30,-40,-50]
];

const BISHOP_TABLE = [
    [-20,-10,-10,-10,-10,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5, 10, 10,  5,  0,-10],
    [-10,  5,  5, 10, 10,  5,  5,-10],
    [-10,  0, 10, 10, 10, 10,  0,-10],
    [-10, 10, 10, 10, 10, 10, 10,-10],
    [-10,  5,  0,  0,  0,  0,  5,-10],
    [-20,-10,-10,-10,-10,-10,-10,-20]
];

const ROOK_TABLE = [
    [0,  0,  0,  0,  0,  0,  0,  0],
    [5, 10, 10, 10, 10, 10, 10,  5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [-5,  0,  0,  0,  0,  0,  0, -5],
    [0,  0,  0,  5,  5,  0,  0,  0]
];

const QUEEN_TABLE = [
    [-20,-10,-10, -5, -5,-10,-10,-20],
    [-10,  0,  0,  0,  0,  0,  0,-10],
    [-10,  0,  5,  5,  5,  5,  0,-10],
    [-5,  0,  5,  5,  5,  5,  0, -5],
    [0,  0,  5,  5,  5,  5,  0, -5],
    [-10,  5,  5,  5,  5,  5,  0,-10],
    [-10,  0,  5,  0,  0,  0,  0,-10],
    [-20,-10,-10, -5, -5,-10,-10,-20]
];

const KING_TABLE = [
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-30,-40,-40,-50,-50,-40,-40,-30],
    [-20,-30,-30,-40,-40,-30,-30,-20],
    [-10,-20,-20,-20,-20,-20,-20,-10],
    [20, 20,  0,  0,  0,  0, 20, 20],
    [20, 30, 10,  0,  0, 10, 30, 20]
];

const POSITION_TABLES = {
    pawn: PAWN_TABLE,
    knight: KNIGHT_TABLE,
    bishop: BISHOP_TABLE,
    rook: ROOK_TABLE,
    queen: QUEEN_TABLE,
    king: KING_TABLE
};

// Evaluate the board position
const evaluatePosition = (board) => {
    let score = 0;
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const value = PIECE_VALUES[piece.type];
                const positionValue = POSITION_TABLES[piece.type][i][j];
                const totalValue = value + positionValue;
                
                if (piece.color === 'white') {
                    score += totalValue;
                } else {
                    score -= totalValue;
                }
            }
        }
    }
    
    return score;
};

// Get all valid moves for a piece
const getValidMoves = (piece, from, board) => {
    const moves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (isMoveValid(piece, from, { i, j }, board)) {
                moves.push({ i, j });
            }
        }
    }
    return moves;
};

// Get all valid moves for a color
const getAllValidMoves = (board, color) => {
    const moves = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color === color) {
                const pieceMoves = getValidMoves(piece, { i, j }, board);
                pieceMoves.forEach(move => {
                    moves.push({
                        from: { i, j },
                        to: move,
                        piece
                    });
                });
            }
        }
    }
    return moves;
};

// Make a move on the board
const makeMove = (board, move) => {
    const newBoard = board.map(row => row.slice());
    newBoard[move.to.i][move.to.j] = move.piece;
    newBoard[move.from.i][move.from.j] = null;
    return newBoard;
};

// Minimax algorithm with alpha-beta pruning
const minimax = (board, depth, alpha, beta, maximizingPlayer) => {
    if (depth === 0) {
        return evaluatePosition(board);
    }

    const color = maximizingPlayer ? 'white' : 'black';
    const moves = getAllValidMoves(board, color);

    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            const newBoard = makeMove(board, move);
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evaluation);
            alpha = Math.max(alpha, evaluation);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            const newBoard = makeMove(board, move);
            const evaluation = minimax(newBoard, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evaluation);
            beta = Math.min(beta, evaluation);
            if (beta <= alpha) break;
        }
        return minEval;
    }
};

// Get the best move for the computer
export const getComputerMove = (board) => {
    const moves = getAllValidMoves(board, 'black');
    let bestMove = null;
    let bestEval = Infinity;
    const depth = 3; // Adjust depth for difficulty

    for (const move of moves) {
        const newBoard = makeMove(board, move);
        const evaluation = minimax(newBoard, depth - 1, -Infinity, Infinity, true);
        
        if (evaluation < bestEval) {
            bestEval = evaluation;
            bestMove = move;
        }
    }

    return bestMove;
}; 