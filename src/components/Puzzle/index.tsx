import React, { useCallback, useMemo } from 'react';
import findLast from 'lodash/fp/findLast';
import { useEngine } from '../../engine';
import Equation from '../Equation';
import Footer from '../Footer';
import Target from '../Target';
import './Puzzle.scss';

const Puzzle: React.FC = () => {
  const engine = useEngine();

  const { state } = engine;

  const playNumber = useCallback(
    (card: Card) => {
      if (state) {
        const row = state.rows.findIndex((r) => !r.left || !r.right);
        const side = state.rows[row].left ? 'right' : 'left';
        engine.use({ row, side, card });
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

  if (!state) return null;

  return (
    <div className="puzzle">
      <div className="board">
        {state.rows.map((row, i) => (
          <Equation key={i} {...row} onOperatorChange={(op) => operatorChanged(i, op)} />
        ))}
      </div>
      <Footer cards={state.cards} onCardClicked={playNumber}>
        <Target target={state.target} total={total} />
      </Footer>
    </div>
  );
};

export default Puzzle;
