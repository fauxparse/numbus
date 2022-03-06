import React from 'react';
import Header from './components/Header';
import Puzzle from './components/Puzzle';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Header />
      <div className="app__body">
        <Puzzle givens={[100, 50, 2, 6, 5, 9]} target={334} />
      </div>
    </div>
  );
}

export default App;
