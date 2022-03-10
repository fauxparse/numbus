import { ComponentPropsWithoutRef, forwardRef, useCallback } from 'react';
import Cell from '../Cell';
import DraggableNumber from '../Number/DraggableNumber';
import './Footer.scss';

interface FooterProps extends ComponentPropsWithoutRef<'footer'> {
  cards: Immutable<Maybe<Card>[]>;
  onCardClicked?: (card: Card) => void;
}

const Footer = forwardRef<HTMLDivElement, FooterProps>(
  ({ cards, children, onCardClicked }, ref) => {
    const cardClicked = useCallback(
      (card: Card) => {
        if (onCardClicked) onCardClicked(card);
      },
      [onCardClicked]
    );

    return (
      <div className="footer" ref={ref}>
        {children}
        {cards.map((card, i) => (
          <Cell key={i} droppable={!card || undefined}>
            {card && <DraggableNumber {...card} onClick={() => cardClicked(card)} />}
          </Cell>
        ))}
      </div>
    );
  }
);

Footer.displayName = 'Footer';

export default Footer;
