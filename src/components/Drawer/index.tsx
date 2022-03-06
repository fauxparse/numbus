import React from 'react';
import Stock, { StockProps } from '../Stock';
import Target, { TargetProps } from '../Target';
import './Drawer.scss';

export type DrawerProps = StockProps & TargetProps;

const Drawer: React.FC<DrawerProps> = ({ numbers, target, total }) => {
  return (
    <footer className="drawer">
      <Stock numbers={numbers} />
      <Target target={target} total={total} />
    </footer>
  );
};

export default Drawer;
