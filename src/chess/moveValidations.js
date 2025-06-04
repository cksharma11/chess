export const isMoveValid = (piece, from, to, board, moveHistory) => {
    // Basic validation
    if (!piece || !from || !to || !board) return false;
    
    // Can't capture your own pieces
    if (board[to.i][to.j] && board[to.i][to.j].color === piece.color) return false;

    const rowDiff = to.i - from.i;
    const colDiff = to.j - from.j;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    switch (piece.type) {
        case 'pawn':
            const direction = piece.color === 'white' ? -1 : 1;
            
            // Normal move forward
            if (colDiff === 0 && absRowDiff === 1 && !board[to.i][to.j]) {
                return true;
            }
            
            // Initial two-square move
            if (colDiff === 0 && absRowDiff === 2 && !board[to.i][to.j]) {
                const startRow = piece.color === 'white' ? 6 : 1;
                const middleRow = from.i + direction;
                return from.i === startRow && !board[middleRow][from.j];
            }
            
            // Normal capture
            if (absColDiff === 1 && absRowDiff === 1 && board[to.i][to.j]) {
                return true;
            }
            
            // En passant capture
            if (absColDiff === 1 && absRowDiff === 1 && !board[to.i][to.j]) {
                if (moveHistory?.enPassantTarget) {
                    const { i, j } = moveHistory.enPassantTarget;
                    return to.i === i && to.j === j;
                }
            }
            return false;

        case 'rook':
            return (rowDiff === 0 || colDiff === 0) && !isPathBlocked(from, to, board);

        case 'knight':
            return (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);

        case 'bishop':
            return absRowDiff === absColDiff && !isPathBlocked(from, to, board);

        case 'queen':
            return ((rowDiff === 0 || colDiff === 0) || absRowDiff === absColDiff) && !isPathBlocked(from, to, board);

        case 'king':
            return absRowDiff <= 1 && absColDiff <= 1;

        default:
            return false;
    }
};

const isPathBlocked = (from, to, board) => {
    const rowDiff = to.i - from.i;
    const colDiff = to.j - from.j;
    const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
    const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
    
    let currentRow = from.i + rowStep;
    let currentCol = from.j + colStep;
    
    while (currentRow !== to.i || currentCol !== to.j) {
        if (board[currentRow][currentCol]) {
            return true;
        }
        currentRow += rowStep;
        currentCol += colStep;
    }
    
    return false;
};
