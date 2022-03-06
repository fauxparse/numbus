import React from 'react';
import { usePuzzleReducer } from '../../util/state';
import Stock from '../Stock';
import Target, { TargetProps } from '../Target';
import './Drawer.scss';

export type DrawerProps = TargetProps;

const Drawer: React.FC<DrawerProps> = ({ target, total }) => {
  const [state] = usePuzzleReducer();

  return (
    <footer className="drawer">
      <Stock />
      <Target target={target} total={total} />
    </footer>
  );
};

export default Drawer;
