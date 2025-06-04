export const createMoveHistory = () => ({
    lastMove: null,
    enPassantTarget: null
});

export const updateMoveHistory = (history, from, to, piece, board) => {
    const newHistory = {
        lastMove: { from, to, piece },
        enPassantTarget: null
    };

    // Check for en passant opportunity
    if (piece.type === 'pawn') {
        const rowDiff = Math.abs(to.i - from.i);
        if (rowDiff === 2) {
            // Pawn moved two squares, set en passant target
            const enPassantRow = from.i + (piece.color === 'white' ? -1 : 1);
            newHistory.enPassantTarget = { i: enPassantRow, j: from.j };
        }
    }

    return newHistory;
}; 