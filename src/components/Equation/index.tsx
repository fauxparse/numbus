import React, { useCallback } from 'react';
import Cell from '../Cell';
import Equals from '../Equals';
import Number from '../Number';
import DraggableNumber from '../Number/DraggableNumber';
import OperatorButton from '../OperatorButton';
import './Equation.scss';

interface EquationProps extends Row {
  row?: number;
  onOperatorChange: (operator: Maybe<Operator>) => void;
  onCardClicked?: (card: Card) => void;
}

const Equation: React.FC<EquationProps> = ({
  row,
  left,
  operator,
  right,
  result,
  onOperatorChange,
  onCardClicked,
}) => {
  const cardClicked = useCallback(
    (card: Card) => {
      if (onCardClicked) onCardClicked(card);
    },
    [onCardClicked]
  );

  return (
    <div className="equation">
      <Cell
        className="cell--operand"
        data-row={row}
        data-side="left"
        droppable={!left || undefined}
      >
        {left && <DraggableNumber {...left} onClick={() => cardClicked(left)} />}
      </Cell>
      <Cell>
        <OperatorButton operator={operator} onChange={onOperatorChange} />
      </Cell>
      <Cell
        className="cell--operand"
        data-row={row}
        data-side="right"
        droppable={!right || undefined}
      >
        {right && <DraggableNumber {...right} onClick={() => cardClicked(right)} />}
      </Cell>
      <Equals />
      <Cell className="cell--operand">{result && <Number {...result} />}</Cell>
    </div>
  );
};

export default Equation;
