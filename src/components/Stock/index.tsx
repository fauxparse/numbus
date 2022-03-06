import React from 'react';
import { isJust, isNothing } from '../../util/maybe';
import Number from '../Number';
import Cell from '../Cell';
import './Stock.scss';
import { usePuzzleReducer, Verbs } from '../../util/state';

const Stock: React.FC = () => {
  const [{ rows, slots, stock }, dispatch] = usePuzzleReducer();

  const placeNumber = (i: number): void => {
    const row =
      (rows.findIndex((r) => isNothing(r.left) || isNothing(r.right)) + rows.length + 1) %
      (rows.length + 1);
    const column = isJust(rows[row].left) ? 'right' : 'left';
    dispatch({ verb: Verbs.PlaceNumber, slot: stock[i] as number, row, column });
  };

  return (
    <div className="stock">
      {stock.map((index, i) =>
        isJust(index) ? (
          <Number
            key={i}
            {...(slots.get(index) || { number: null })}
            onClick={() => placeNumber(i)}
          />
        ) : (
          <Cell key={i} />
        )
      )}
    </div>
  );
};

export default Stock;
