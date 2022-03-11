import React, { ComponentProps } from 'react';
import clsx from 'clsx';
import './Button.scss';

const Button: React.FC<ComponentProps<'button'>> = ({ className, children, ...props }) => (
  <button className={clsx('button', className)} {...props}>
    {children}
  </button>
);

export default Button;
