import React, { ComponentPropsWithoutRef } from 'react';
import clsx from 'clsx';
import Cell from '../Cell';
import './Equals.scss';

export type EqualsProps = ComponentPropsWithoutRef<'div'>;

const Equals: React.FC<EqualsProps> = ({ className, ...props }) => {
  return (
    <Cell as="div" className={clsx('equals', className)} {...props}>
      <svg viewBox="-18 -18 36 36">
        <rect x={-12} y={-8} width={24} height={6} rx={2} />
        <rect x={-12} y={3} width={24} height={6} rx={2} />
      </svg>
    </Cell>
  );
};

export default Equals;
