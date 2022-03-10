import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

  useEffect(() => {
    const boardElement = board.current;
    if (boardElement) {
      boardElement.addEventListener('dropcard', droppedOnBoard);
      return () => boardElement.removeEventListener('dropcard', droppedOnBoard);
    }
  }, [footer, droppedOnBoard]);

  const before = useRef<HTMLDivElement>(null);
  const after = useRef<HTMLDivElement>(null);

  const [startVisible, setStartVisible] = useState(true);
  const [endVisible, setEndVisible] = useState(true);

  useEffect(() => {
    const container = board.current as HTMLElement;

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(({ target, isIntersecting }) => {
          switch ((target as HTMLElement).dataset.edge) {
            case 'before':
              setStartVisible(isIntersecting);
              break;
            case 'after':
              setEndVisible(isIntersecting);
              break;
          }
        });
      },
      { threshold: 0 }
    );

    container.querySelectorAll('.edge').forEach((el) => {
      intersectionObserver.observe(el);
    });

    return () => {
      intersectionObserver.disconnect();
    };
  }, []);

  if (!state) return null;

  return (
    <div
      className="puzzle"
      data-start-visible={startVisible || undefined}
      data-end-visible={endVisible || undefined}
    >
      <div className="board" ref={board}>
        <div className="edge" data-edge="before" ref={before} />
        {state.rows.map((row, i) => (
          <Equation
            key={i}
            row={i}
            {...row}
            onOperatorChange={(op) => operatorChanged(i, op)}
            onCardClicked={unplayNumber}
          />
        ))}
        <div className="edge" data-edge="after" ref={after} />
      </div>
      <Footer ref={footer} cards={state.cards} onCardClicked={playNumber}>
        <Target target={state.target} total={total} />
      </Footer>
    </div>
  );
};

export default Puzzle;
