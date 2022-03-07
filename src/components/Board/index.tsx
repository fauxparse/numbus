import React from 'react';
import Equation from '../Equation';
import { usePuzzleReducer } from '../../util/state';
import { maybe } from '../../util/maybe';
import './Board.scss';

interface BoardProps {}

const Board: React.FC<BoardProps> = () => {
  const [state] = usePuzzleReducer();
  const {
    rows,
    slots,
    givens: { length: givens },
  } = state;

  return (
    <div className="board">
      {rows.map((row, i) => (
        <Equation
          key={i}
          row={i}
          left={maybe(row.left === null ? null : slots[row.left])}
          right={maybe(row.right === null ? null : slots[row.right])}
          operator={row.operator}
          result={maybe(slots[i + givens])}
        />
      ))}
    </div>
  );
};

export default Board;
