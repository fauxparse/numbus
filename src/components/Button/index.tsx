import React, { ComponentPropsWithoutRef, forwardRef } from 'react';
import clsx from 'clsx';
import './Button.scss';

const Button = forwardRef<HTMLButtonElement, ComponentPropsWithoutRef<'button'>>(
  ({ className, children, ...props }, ref) => (
    <button ref={ref} className={clsx('button', className)} {...props}>
      {children}
    </button>
  )
);

export default Button;
