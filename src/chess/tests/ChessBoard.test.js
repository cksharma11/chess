import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import ChessBoard from '../ChessBoard';
import '@testing-library/jest-dom/extend-expect';

test('renders the initial chessboard with pieces in correct positions', () => {
    const {getAllByText} = render(<ChessBoard/>);

    // Check for a white pawn
    expect(getAllByText('\u2659').length).toBe(8);
    // Check for a black pawn
    expect(getAllByText('\u265F').length).toBe(8);

    // Check for specific pieces
    expect(getAllByText('\u2654').length).toBe(1); // White king
    expect(getAllByText('\u265A').length).toBe(1); // Black king
});

test('prevents a piece from moving if it is not its turn', () => {
    const {getAllByText} = render(<ChessBoard/>);

    // Get a white pawn
    const whitePawn = getAllByText('\u2659')[0];
    fireEvent.click(whitePawn);

    // Try to move to an invalid square (e.g., wrong turn)
    fireEvent.click(getAllByText('\u265F')[0]);

    // Ensure the piece didn't move
    expect(getAllByText('\u2659').length).toBe(8);
    expect(getAllByText('\u265F').length).toBe(8);
});

test('allows a piece to move if the move is valid', () => {
    const {getByText, getAllByText} = render(<ChessBoard/>);

    // Get a white pawn
    const whitePawn = getAllByText('\u2659')[0];
    fireEvent.click(whitePawn);

    // Move the white pawn forward
    fireEvent.click(getByText('', {selector: 'div.square:nth-child(17)'}));

    // Check if the white pawn has moved
    expect(getAllByText('\u2659').length).toBe(8);
    expect(getByText('\u2659')).toBeInTheDocument();
});
