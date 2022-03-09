import React from 'react';
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
      <Cell>{left && <Number {...left} />}</Cell>
      <Cell>
        <OperatorButton operator={operator} onChange={onOperatorChange} />
      </Cell>
      <Cell>{right && <Number {...right} />}</Cell>
      <Equals />
      <Cell>{result && <Number {...result} />}</Cell>
    </div>
  );
};

export default Equation;
