import React, { ComponentPropsWithoutRef, useMemo } from 'react';
import clsx from 'clsx';
import './Number.scss';

export enum NumberColor {
  Given = 'given',
  Computed = 'computed',
  Target = 'target',
}

export interface NumberProps extends ComponentPropsWithoutRef<'button'> {
  number: number;
  color?: NumberColor;
}

const Number: React.FC<NumberProps> = ({
  className,
  number,
  color = NumberColor.Given,
  ...props
}) => {
  const digits = useMemo(() => Math.ceil(Math.log10(number + 0.1)), [number]);

  return (
    <button className={clsx('number', className)} data-digits={digits} data-color={color}>
      {number}
    </button>
  );
};

export default Number;
