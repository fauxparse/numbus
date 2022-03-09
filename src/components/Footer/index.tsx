import React, { useCallback } from 'react';
import Cell from '../Cell';
import Number from '../Number';
import './Footer.scss';

interface FooterProps {
  cards: Immutable<Maybe<Card>[]>;
  onCardClicked?: (card: Card) => void;
}

const Footer: React.FC<FooterProps> = ({ cards, children, onCardClicked }) => {
  const cardClicked = useCallback(
    (card: Card) => {
      if (onCardClicked) onCardClicked(card);
    },
    [onCardClicked]
  );

  return (
    <div className="footer">
      {children}
      {cards.map((card, i) => (
        <Cell key={i}>{card && <Number {...card} onClick={() => cardClicked(card)} />}</Cell>
      ))}
    </div>
  );
};

export default Footer;
