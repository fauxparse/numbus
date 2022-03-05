import React from 'react';

const Decorator: React.FC = ({ children }) => (
  <div
    style={{
      minWidth: '100vw',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {children}
  </div>
);

export default Decorator;
