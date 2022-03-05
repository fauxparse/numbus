import React, { ElementType, forwardRef, ReactElement } from 'react';
import clsx from 'clsx';
import { PolymorphicComponentProps, PolymorphicRef, WithDisplayName } from '../../util/polymorphic';
import './Cell.scss';

export type CellProps<C extends ElementType> = PolymorphicComponentProps<C>;

export type CellComponent = WithDisplayName<
  <C extends ElementType = 'button'>(props: CellProps<C>) => ReactElement | null
>;

const Cell: CellComponent = forwardRef(
  <T extends ElementType = 'div'>(
    { as, className, ...props }: CellProps<T>,
    ref: PolymorphicRef<T>
  ) => {
    const Component = as || 'div';
    return <Component ref={ref} className={clsx('cell', className)} {...props} />;
  }
);

export default Cell;
