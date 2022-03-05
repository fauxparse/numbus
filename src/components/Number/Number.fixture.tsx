import React from 'react';
import { useValue, useSelect } from 'react-cosmos/fixture';
import Number, { NumberProps, NumberColor } from '.';

const NumberFixture: React.FC<NumberProps> = () => {
  const [number] = useValue('number', { defaultValue: 1 });
  const [color] = useSelect<keyof typeof NumberColor>('color', {
    defaultValue: 'Given',
    options: Object.keys(NumberColor) as (keyof typeof NumberColor)[],
  });
  return <Number number={number} color={NumberColor[color]} />;
};

export default NumberFixture;
