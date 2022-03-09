import React, { useState } from 'react';
import OperatorButton from '.';
import Cell from '../Cell';

const OperatorButtonFixture: React.FC = () => {
  const [operator, setOperator] = useState<Maybe<Operator>>(null);

  return (
    <Cell data-empty={!operator || undefined}>
      <OperatorButton operator={operator} onChange={setOperator} />
    </Cell>
  );
};

export default <OperatorButtonFixture />;
