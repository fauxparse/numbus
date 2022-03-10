import React from 'react';
import { Flipped } from 'react-flip-toolkit';
import Cell from '../Cell';
import Equals from '../Equals';
import Number from '../Number';
import OperatorButton from '../OperatorButton';
import './Equation.scss';

interface EquationProps extends Row {
  onOperatorChange: (operator: Maybe<Operator>) => void;
}

const Equation: React.FC<EquationProps> = ({ left, operator, right, result, onOperatorChange }) => {
  return (
    <div className="equation">
      <Cell className="cell--operand">
        {left && (
          <Flipped flipId={left.id}>
            <Number {...left} />
          </Flipped>
        )}
      </Cell>
      <Cell>
        <OperatorButton operator={operator} onChange={onOperatorChange} />
      </Cell>
      <Cell className="cell--operand">
        {right && (
          <Flipped flipId={right.id}>
            <Number {...right} />
          </Flipped>
        )}
      </Cell>
      <Equals />
      <Cell className="cell--operand">{result && <Number {...result} />}</Cell>
    </div>
  );
};

export default Equation;
