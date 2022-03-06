import React from 'react';
import Drawer from './components/Drawer';
import Header from './components/Header';
import './App.scss';
import Equation from './components/Equation';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <div className="puzzle">
          <Equation />
          <Equation />
          <Equation />
          <Equation />
          <Equation />
        </div>
        <Drawer numbers={[1, 2, 3, 4, 5, 6]} target={999} total={1} />
      </div>
    </div>
  );
}

export default App;
