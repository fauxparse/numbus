import React, { ComponentPropsWithoutRef, useMemo } from 'react';
import clsx from 'clsx';
import Cell from '../Cell';
import './Number.scss';
import { isJust, Maybe } from '../../util/maybe';

export enum NumberColor {
  Given = 'given',
  Computed = 'computed',
  Target = 'target',
}

export interface NumberProps extends ComponentPropsWithoutRef<'button'> {
  number: Maybe<number>;
  color?: NumberColor;
}

const Number: React.FC<NumberProps> = ({
  className,
  number,
  color = NumberColor.Given,
  ...props
}) => {
  const digits = useMemo(
    () => (isJust(number) ? Math.ceil(Math.log10(number + 0.1)) : 1),
    [number]
  );

  return (
    <Cell
      as="button"
      className={clsx('number', className)}
      data-digits={digits}
      data-color={color}
      {...props}
    >
      {isJust(number) && number}
    </Cell>
  );
};

export default Number;
