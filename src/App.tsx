import Header from './components/Header';
import Drawer from './components/Drawer';
import Puzzle from './components/Puzzle';
import { EngineProvider } from './engine';
import './App.scss';

const App = () => (
  <EngineProvider>
    <div className="app">
      <Drawer>
        <Header />
      </Drawer>
      <div className="app__body">
        <Puzzle />
      </div>
    </div>
  </EngineProvider>
);

export default App;
