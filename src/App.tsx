import React, { useState } from 'react';
import Header, { HeaderButtonContext } from './components/Header';
import Drawer from './components/Drawer';
import Puzzle from './components/Puzzle';
import './App.scss';

function App() {
  const [headerButtons, setHeaderButtons] = useState<HTMLDivElement | null>(null);

  return (
    <HeaderButtonContext.Provider value={headerButtons}>
      <div className="app">
        <Drawer>
          <Header ref={setHeaderButtons} />
        </Drawer>
        <div className="app__body">
          <Puzzle givens={[100, 50, 2, 6, 5, 9]} target={334} />
        </div>
      </div>
    </HeaderButtonContext.Provider>
  );
}

export default App;
