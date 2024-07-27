import React from 'react';
import {render, fireEvent} from '@testing-library/react';
import ChessBoard from '../ChessBoard';
import '@testing-library/jest-dom/extend-expect';

test('renders the initial chessboard with pieces in correct positions', () => {
    const {getAllByText} = render(<ChessBoard/>);

    expect(getAllByText('\u2659').length).toBe(8);
    expect(getAllByText('\u265F').length).toBe(8);
    expect(getAllByText('\u2654').length).toBe(1);
    expect(getAllByText('\u265A').length).toBe(1);
});

test('prevents a piece from moving if it is not its turn', () => {
    const {getAllByText} = render(<ChessBoard/>);

    const whitePawn = getAllByText('\u2659')[0];
    fireEvent.click(whitePawn);
    fireEvent.click(getAllByText('\u265F')[0]);

    expect(getAllByText('\u2659').length).toBe(8);
    expect(getAllByText('\u265F').length).toBe(8);
});

test('allows a piece to move if the move is valid', () => {
    const {getByText, getAllByText} = render(<ChessBoard/>);

    const whitePawn = getAllByText('\u2659')[0];
    fireEvent.click(whitePawn);
    fireEvent.click(getByText('', {selector: 'div.square:nth-child(17)'}));

    expect(getAllByText('\u2659').length).toBe(8);
    expect(getByText('\u2659')).toBeInTheDocument();
});
