import React, { useCallback } from 'react';
import { Flipped } from 'react-flip-toolkit';
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
        <Cell key={i}>
          {card && (
            <Flipped flipId={card.id}>
              <Number {...card} onClick={() => cardClicked(card)} />
            </Flipped>
          )}
        </Cell>
      ))}
    </div>
  );
};

export default Footer;
