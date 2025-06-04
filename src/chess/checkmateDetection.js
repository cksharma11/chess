import { isMoveValid } from './moveValidations';

const findKing = (board, color) => {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.type === 'king' && piece.color === color) {
                return { i, j };
            }
        }
    }
    return null;
};

const isKingInCheck = (board, color) => {
    const king = findKing(board, color);
    if (!king) return false;

    // Check if any opponent piece can capture the king
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color !== color) {
                if (isMoveValid(piece, { i, j }, king, board)) {
                    return true;
                }
            }
        }
    }
    return false;
};

const hasValidMoves = (board, color) => {
    // Try all possible moves for all pieces of the given color
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece && piece.color === color) {
                // Try moving to every square on the board
                for (let x = 0; x < 8; x++) {
                    for (let y = 0; y < 8; y++) {
                        if (isMoveValid(piece, { i, j }, { i: x, j: y }, board)) {
                            // Try the move
                            const newBoard = board.map(row => row.slice());
                            newBoard[x][y] = piece;
                            newBoard[i][j] = null;

                            // If the move doesn't leave the king in check, it's valid
                            if (!isKingInCheck(newBoard, color)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
};

export const isCheckmate = (board, color) => {
    // If the king is in check and there are no valid moves, it's checkmate
    return isKingInCheck(board, color) && !hasValidMoves(board, color);
}; 