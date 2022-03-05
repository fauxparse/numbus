import React from 'react';
import { useSelect } from 'react-cosmos/fixture';
import invert from 'lodash/invert';
import Operator, { OperatorProps, Operation } from '.';

type OperationOption = 'None' | keyof typeof Operation;

const INVERTED = { ...invert(Operation) } as Record<Operation, keyof typeof Operation>;

const OperatorFixture: React.FC<OperatorProps> = () => {
  const [operation, setOperation] = useSelect<OperationOption>('operation', {
    defaultValue: 'None',
    options: ['None', ...(Object.keys(Operation) as (keyof typeof Operation)[])],
  });
  return (
    <Operator
      operation={operation === 'None' ? undefined : Operation[operation]}
      onChange={(op: Operation | null) => {
        console.log(`onChange(${op})`);
        setOperation(op ? INVERTED[op] : 'None');
      }}
    />
  );
};

export default OperatorFixture;
