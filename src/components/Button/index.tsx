import React, { ComponentProps } from 'react';
import clsx from 'clsx';
import './Button.scss';

const Button: React.FC<ComponentProps<'button'>> = ({ className, ...props }) => {
  return <button className={clsx('button', className)} {...props} />;
};

export default Button;
