import React from 'react';
import { isJust, Maybe } from '../../util/maybe';
import Number from '../Number';
import Cell from '../Cell';
import './Stock.scss';

export interface StockProps {
  numbers: Maybe<number>[];
}

const Stock: React.FC<StockProps> = ({ numbers }) => {
  return (
    <div className="stock">
      {numbers.map((number, i) =>
        // eslint-disable-next-line react/jsx-no-undef
        isJust<number>(number) ? <Number key={i} number={number} /> : <Cell key={i} />
      )}
    </div>
  );
};

export default Stock;
