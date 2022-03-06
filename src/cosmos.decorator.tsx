import React from 'react';

const Decorator: React.FC = ({ children }) => (
  <div
    style={{
      minWidth: '100vw',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '0 calc(50vw - 200px)',
    }}
  >
    {children}
  </div>
);

export default Decorator;
