import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import findLast from 'lodash/fp/findLast';
import { useEngine } from '../../engine';
import Equation from '../Equation';
import Footer from '../Footer';
import Target from '../Target';
import './Puzzle.scss';
import gsap from 'gsap';

const Puzzle: React.FC = () => {
  const board = useRef<HTMLDivElement>(null);

  const footer = useRef<HTMLDivElement>(null);

  const engine = useEngine();

  const { state } = engine;

  const playNumber = useCallback(
    (card: Card) => {
      if (state) {
        const row = state.rows.findIndex((r) => !r.left || !r.right);
        const side = state.rows[row].left ? 'right' : 'left';
        console.log(row, side);
        const target = board.current?.querySelector(`[data-row="${row}"][data-side="${side}"]`);
        const source = footer.current?.querySelector(`[data-id="${card.id}"]`);
        if (source && target) {
          const { x: sourceX, y: sourceY } = source.getBoundingClientRect();
          const { x: targetX, y: targetY } = target.getBoundingClientRect();
          gsap.to(source, {
            x: targetX - sourceX,
            y: targetY - sourceY,
            duration: 0.15,
            onComplete: () => {
              engine.use({ row, side, card });
            },
          });
        }
      }
    },
    [state, engine]
  );

  const unplayNumber = useCallback(
    (card: Card) => {
      if (state) {
        engine.unuse({ card });
      }
    },
    [state, engine]
  );

  const operatorChanged = useCallback(
    (row: number, operator: Maybe<Operator>) => state && engine.operate({ row, operator }),
    [state, engine]
  );

  const total = useMemo(
    () => (state && findLast((r) => !!r.result, state.rows)?.result?.number) || 0,
    [state]
  );

  const droppedOnBoard = useCallback(
    (e) => {
      if (!state) return;
      const {
        destination: { row, side },
        card,
      } = e.detail;
      engine.use({ row, side, card });
    },
    [state, engine]
  );

  const droppedOnFooter = useCallback(
    (e) => {
      if (state && !state.cards.includes(e.detail.card)) engine.unuse({ card: e.detail.card });
    },
    [state, engine]
  );

  useEffect(() => {
    const boardElement = board.current;
    if (boardElement) {
      boardElement.addEventListener('dropcard', droppedOnBoard);
      return () => boardElement.removeEventListener('dropcard', droppedOnBoard);
    }
  }, [footer, droppedOnBoard]);

  useEffect(() => {
    const footerElement = footer.current;
    if (footerElement) {
      footerElement.addEventListener('dropcard', droppedOnFooter);
      return () => footerElement.removeEventListener('dropcard', droppedOnFooter);
    }
  }, [footer, droppedOnFooter]);

  if (!state) return null;

  return (
    <div className="puzzle">
      <div className="board" ref={board}>
        {state.rows.map((row, i) => (
          <Equation
            key={i}
            row={i}
            {...row}
            onOperatorChange={(op) => operatorChanged(i, op)}
            onCardClicked={unplayNumber}
          />
        ))}
      </div>
      <Footer ref={footer} cards={state.cards} onCardClicked={playNumber}>
        <Target target={state.target} total={total} />
      </Footer>
    </div>
  );
};

export default Puzzle;
