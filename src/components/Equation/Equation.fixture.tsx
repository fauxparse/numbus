import React, { useState } from 'react';
import Equation from '.';

const EquationFixture = () => {
  const [operator, setOperator] = useState<Maybe<Operator>>('times');
  return (
    <Equation
      left={{ id: 1, number: 23, source: 'given' }}
      operator={operator}
      right={{ id: 2, number: 3, source: 'calculated' }}
      result={{ id: 3, number: 69, source: 'target' }}
      onOperatorChange={setOperator}
    />
  );
};

export default EquationFixture;
