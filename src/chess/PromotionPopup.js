import React from 'react';
import RoyalChessPiece from './RoyalChessPiece';

const PromotionPopup = ({ color, onSelect }) => {
    const pieces = ['queen', 'rook', 'bishop', 'knight'];
    
    return (
        <div className="promotion-overlay">
            <div className="promotion-popup">
                <h3>Choose a piece to promote to:</h3>
                <div className="promotion-options">
                    {pieces.map(piece => (
                        <div 
                            key={piece}
                            className="promotion-option"
                            onClick={() => onSelect(piece)}
                        >
                            <RoyalChessPiece 
                                type={piece} 
                                color={color}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PromotionPopup; 