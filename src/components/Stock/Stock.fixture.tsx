import React, { useState } from 'react';
import Stock from '.';

const StockFixture: React.FC = () => {
  const [numbers] = useState([1, 2, 3, 25, 100, null]);
  return <Stock numbers={numbers} />;
};

export default StockFixture;
