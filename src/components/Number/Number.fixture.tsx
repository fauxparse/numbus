import React from 'react';
import { useValue, useSelect } from 'react-cosmos/fixture';
import Number, { NumberProps, NumberSource } from '.';

const NumberFixture: React.FC<NumberProps> = () => {
  const [number] = useValue('number', { defaultValue: 1 });
  const [color] = useSelect<keyof typeof NumberSource>('color', {
    defaultValue: 'Given',
    options: Object.keys(NumberSource) as (keyof typeof NumberSource)[],
  });
  return <Number number={number} color={NumberSource[color]} />;
};

export default NumberFixture;
