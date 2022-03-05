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
    <div
      style={{
        width: '400px',
        maxWidth: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {children}
    </div>
  </div>
);

export default Decorator;
