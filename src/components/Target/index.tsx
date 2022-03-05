import React from 'react';
import { Maybe } from '../../util/maybe';
import './Target.scss';

export interface TargetProps {
  target: number;
  total: Maybe<number>;
}

const Target: React.FC<TargetProps> = ({ target, total }) => {
  return (
    <div className="target">
      <h3>Target</h3>
      <div className="target__number">{target}</div>
      <div className="target__distance">{total && `${total} away`}</div>
    </div>
  );
};

export default Target;
