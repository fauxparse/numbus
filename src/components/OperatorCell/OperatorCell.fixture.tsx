import React from 'react';
import { useSelect } from 'react-cosmos/fixture';
import invert from 'lodash/invert';
import { Operator } from '../../util/operators';
import OperatorCell from '.';

type OperatorOption = 'None' | keyof typeof Operator;

const INVERTED = { ...invert(Operator) } as Record<Operator, keyof typeof Operator>;

const OperatorFixture: React.FC = () => {
  const [operator, setOperator] = useSelect<OperatorOption>('operator', {
    defaultValue: 'None',
    options: ['None', ...(Object.keys(Operator) as (keyof typeof Operator)[])],
  });
  return (
    <OperatorCell
      operator={operator === 'None' ? null : Operator[operator]}
      onChange={(op: Operator | null) => {
        console.log(`onChange(${op})`);
        setOperator(op ? INVERTED[op] : 'None');
      }}
    />
  );
};

export default OperatorFixture;
