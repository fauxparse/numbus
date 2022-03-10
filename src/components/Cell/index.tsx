import clsx from 'clsx';
import { ComponentPropsWithoutRef, forwardRef, useRef } from 'react';
import mergeRefs from 'react-merge-refs';
import './Cell.scss';

export type DropEvent = CustomEvent<{
  card: Card;
  destination: { row: number; side: Side } | 'stock';
}>;

type CellProps = ComponentPropsWithoutRef<'div'> & {
  droppable?: true;
};

const Cell = forwardRef<HTMLDivElement, CellProps>(
  ({ className, children, droppable, ...props }, ref) => {
    const ownRef = useRef<HTMLDivElement>();

    return (
      <div
        ref={mergeRefs([ref, ownRef])}
        className={clsx('cell', className)}
        data-droppable={droppable || undefined}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export default Cell;
