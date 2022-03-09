import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';
import './Number.scss';

interface NumberProps extends Omit<ComponentPropsWithoutRef<'button'>, 'id'> {
  id?: number;
  number: number;
  source: Source;
}

const Number = forwardRef<HTMLButtonElement, NumberProps>(
  ({ className, number, source, id, ...props }, ref) => {
    const digits = Math.floor(Math.log10(number)) + 1 || 1;

    return (
      <button
        ref={ref}
        className={clsx('number', className)}
        data-source={source}
        {...props}
        data-digits={digits}
      >
        {number}
      </button>
    );
  }
);

Number.displayName = 'Number';

export default Number;
