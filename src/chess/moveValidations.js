export const isMoveValid = (piece, from, to, board) => {
    if (!piece) return false;
    const targetPiece = board[to.i][to.j];

    if (targetPiece && targetPiece.color === piece.color) return false;

    switch (piece.type) {
        case "pawn":
            return isValidPawnMove(piece, from, to, board);
        case "rook":
            return isValidRookMove(from, to, board);
        case "knight":
            return isValidKnightMove(from, to);
        case "bishop":
            return isValidBishopMove(from, to, board);
        case "queen":
            return isValidQueenMove(from, to, board);
        case "king":
            return isValidKingMove(from, to, board);
        default:
            return false;
    }
};

const isValidPawnMove = (piece, from, to, board) => {
    const direction = piece.color === "white" ? -1 : 1;
    const startRow = piece.color === "white" ? 6 : 1;

    if (from.j === to.j && !board[to.i][to.j]) {
        if (to.i === from.i + direction) return true;
        if (
            from.i === startRow &&
            to.i === from.i + 2 * direction &&
            !board[from.i + direction][from.j]
        )
            return true;
    } else if (
        Math.abs(to.j - from.j) === 1 &&
        to.i === from.i + direction &&
        board[to.i][to.j]
    ) {
        return true;
    }

    return false;
};

const isValidRookMove = (from, to, board) => {
    if (from.i !== to.i && from.j !== to.j) return false;

    const [start, end] = from.i === to.i ? [from.j, to.j] : [from.i, to.i];
    const delta = start < end ? 1 : -1;

    for (let k = start + delta; k !== end; k += delta) {
        if (from.i === to.i && board[from.i][k]) return false;
        if (from.j === to.j && board[k][from.j]) return false;
    }

    return true;
};

const isValidKnightMove = (from, to) => {
    const dx = Math.abs(from.i - to.i);
    const dy = Math.abs(from.j - to.j);
    return (dx === 2 && dy === 1) || (dx === 1 && dy === 2);
};

const isValidBishopMove = (from, to, board) => {
    if (Math.abs(from.i - to.i) !== Math.abs(from.j - to.j)) return false;

    const deltaI = from.i < to.i ? 1 : -1;
    const deltaJ = from.j < to.j ? 1 : -1;

    for (let k = 1; k < Math.abs(from.i - to.i); k++) {
        if (board[from.i + k * deltaI][from.j + k * deltaJ]) return false;
    }

    return true;
};

const isValidQueenMove = (from, to, board) => {
    return isValidRookMove(from, to, board) || isValidBishopMove(from, to, board);
};

const isValidKingMove = (from, to, board) => {
    const dx = Math.abs(from.i - to.i);
    const dy = Math.abs(from.j - to.j);
    return dx <= 1 && dy <= 1;
};
