import { isMoveValid } from '../moveValidations';

const emptyBoard = Array(8).fill(null).map(() => Array(8).fill(null));

test('validates pawn moves correctly', () => {
    const whitePawn = { type: 'pawn', color: 'white' };
    const blackPawn = { type: 'pawn', color: 'black' };

    expect(isMoveValid(whitePawn, { i: 6, j: 0 }, { i: 4, j: 0 }, emptyBoard)).toBe(true);
    expect(isMoveValid(blackPawn, { i: 1, j: 0 }, { i: 3, j: 0 }, emptyBoard)).toBe(true);
    expect(isMoveValid(whitePawn, { i: 6, j: 0 }, { i: 5, j: 1 }, emptyBoard)).toBe(false);
});

test('validates rook moves correctly', () => {
    const rook = { type: 'rook', color: 'white' };
    const boardWithBlock = emptyBoard.map(row => row.slice());
    boardWithBlock[5][0] = { type: 'pawn', color: 'white' };

    expect(isMoveValid(rook, { i: 7, j: 0 }, { i: 5, j: 0 }, emptyBoard)).toBe(true);
    expect(isMoveValid(rook, { i: 7, j: 0 }, { i: 5, j: 0 }, boardWithBlock)).toBe(false);
});

test('validates knight moves correctly', () => {
    const knight = { type: 'knight', color: 'white' };

    expect(isMoveValid(knight, { i: 7, j: 1 }, { i: 5, j: 2 }, emptyBoard)).toBe(true);

    expect(isMoveValid(knight, { i: 7, j: 1 }, { i: 5, j: 3 }, emptyBoard)).toBe(false);
});

test('validates bishop moves correctly', () => {
    const bishop = { type: 'bishop', color: 'white' };
    const boardWithBlock = emptyBoard.map(row => row.slice());
    boardWithBlock[5][2] = { type: 'pawn', color: 'white' };

    expect(isMoveValid(bishop, { i: 7, j: 0 }, { i: 5, j: 2 }, emptyBoard)).toBe(true);
    expect(isMoveValid(bishop, { i: 7, j: 0 }, { i: 5, j: 2 }, boardWithBlock)).toBe(false);
});

test('validates queen moves correctly', () => {
    const queen = { type: 'queen', color: 'white' };

    expect(isMoveValid(queen, { i: 7, j: 3 }, { i: 5, j: 1 }, emptyBoard)).toBe(true);

    expect(isMoveValid(queen, { i: 7, j: 3 }, { i: 7, j: 7 }, emptyBoard)).toBe(true);

    expect(isMoveValid(queen, { i: 7, j: 3 }, { i: 6, j: 5 }, emptyBoard)).toBe(false);
});

test('validates king moves correctly', () => {
    const king = { type: 'king', color: 'white' };

    expect(isMoveValid(king, { i: 7, j: 4 }, { i: 6, j: 4 }, emptyBoard)).toBe(true);
    expect(isMoveValid(king, { i: 7, j: 4 }, { i: 5, j: 4 }, emptyBoard)).toBe(false);
});
