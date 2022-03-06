import React, { useCallback } from 'react';
import Number from '../Number';
import OperatorCell from '../OperatorCell';
import Equals from '../Equals';
import './Equation.scss';
import { Operator } from '../../util/operators';
import { isJust, Maybe } from '../../util/maybe';
import { Slot, usePuzzleReducer, Verbs } from '../../util/state';

export interface EquationProps {
  row: number;
  left: Maybe<Slot>;
  right: Maybe<Slot>;
  operator: Maybe<Operator>;
  result: Maybe<Slot>;
}

const Equation: React.FC<EquationProps> = ({ row, left, operator, right, result }) => {
  const [, dispatch] = usePuzzleReducer();

  const leftClicked = useCallback(() => {
    if (isJust(left)) {
      dispatch({ verb: Verbs.EraseNumber, row, column: 'left' });
    }
  }, [dispatch, left, row]);

  const rightClicked = useCallback(() => {
    if (isJust(right)) {
      dispatch({ verb: Verbs.EraseNumber, row, column: 'right' });
    }
  }, [dispatch, right, row]);

  const operatorChanged = useCallback(
    (operator: Maybe<Operator>) => {
      dispatch({ verb: Verbs.ChangeOperator, row, operator });
    },
    [dispatch, row]
  );

  return (
    <div className="equation">
      <Number {...(left ?? { number: null })} onClick={leftClicked} />
      <OperatorCell
        operator={isJust(left) || isJust(right) ? operator : null}
        onChange={operatorChanged}
      />
      <Number {...(right ?? { number: null })} onClick={rightClicked} />
      <Equals />
      <Number {...(result ?? { number: null })} />
    </div>
  );
};

export default Equation;
