import clsx from 'clsx';
import React from 'react';
import './Target.scss';

export interface TargetProps {
  target: number;
  total: Maybe<number>;
}

const Target: React.FC<TargetProps> = ({ target, total }) => {
  const displayed = total
    ? target === total
      ? 'Perfect!'
      : `${Math.abs(target - total)} away`
    : '\u00A0';

  return (
    <div className={clsx('target', target === total && 'target--perfect')}>
      <h3>Target</h3>
      <div className="target__number">{target}</div>
      <div className="target__distance">{displayed}</div>
    </div>
  );
};

export default Target;
