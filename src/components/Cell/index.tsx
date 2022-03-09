import clsx from 'clsx';
import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import './Cell.scss';

type CellProps = ComponentPropsWithoutRef<'div'>;

const Cell = forwardRef<HTMLDivElement, CellProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx('cell', className)} {...props}>
      {children}
    </div>
  );
});

export default Cell;
