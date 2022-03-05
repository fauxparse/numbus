import React, { useEffect, useState } from 'react';
import Number from '../Number';
import OperatorCell from '../OperatorCell';
import Equals from '../Equals';
import './Equation.scss';
import Cell from '../Cell';
import { apply, Operator } from '../../util/operators';
import { Maybe } from '../../util/maybe';

interface EquationProps {
  left: Maybe<number>;
  right: Maybe<number>;
  operator: Maybe<Operator>;
}

const Equation: React.FC = () => {
  const [left, setLeft] = useState<number | null>(null);

  const [right, setRight] = useState<number | null>(null);

  const [result, setResult] = useState<number | null>(null);

  const [operator, setOperator] = useState<Operator | null>(null);

  useEffect(() => {
    if (!(left ?? right)) {
      setOperator(null);
    }
  }, [left, right]);

  useEffect(() => {
    setResult(operator ? apply(operator, left, right) : null);
  }, [left, operator, right]);

  return (
    <div className="equation">
      <Number number={left} onClick={() => setLeft((current) => (current ? null : 8))} />
      <OperatorCell operator={operator} onChange={setOperator} />
      <Number number={right} onClick={() => setRight((current) => (current ? null : 5))} />
      <Equals />
      <Number number={result} />
    </div>
  );
};

export default Equation;
