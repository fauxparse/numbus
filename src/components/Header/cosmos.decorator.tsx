import React from 'react';

const Decorator: React.FC = ({ children }) => (
  <div
    style={{
      margin: '0 calc(200px - 50vw)',
      flex: '1',
    }}
  >
    {children}
  </div>
);

export default Decorator;
