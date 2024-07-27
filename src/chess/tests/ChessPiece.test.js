import React from 'react';
import {render} from '@testing-library/react';
import ChessPiece from '../ChessPiece';

test('renders the correct Unicode character for each piece', () => {
    const {getByText} = render(<ChessPiece type="king" color="white"/>);
    expect(getByText('\u2654')).toBeInTheDocument();

    render(<ChessPiece type="queen" color="black"/>);
    expect(getByText('\u265B')).toBeInTheDocument();

    render(<ChessPiece type="rook" color="white"/>);
    expect(getByText('\u2656')).toBeInTheDocument();

    render(<ChessPiece type="bishop" color="black"/>);
    expect(getByText('\u265D')).toBeInTheDocument();

    render(<ChessPiece type="knight" color="white"/>);
    expect(getByText('\u2658')).toBeInTheDocument();

    render(<ChessPiece type="pawn" color="black"/>);
    expect(getByText('\u265F')).toBeInTheDocument();
});
