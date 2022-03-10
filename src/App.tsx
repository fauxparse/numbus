import Header from './components/Header';
import Drawer from './components/Drawer';
import Puzzle from './components/Puzzle';
import { EngineProvider } from './engine';
import './App.scss';
import Keyboard from './Keyboard';

const App = () => (
  <EngineProvider>
    <Keyboard>
      <div className="app">
        <Drawer>
          <Header />
        </Drawer>
        <div className="app__body">
          <Puzzle />
        </div>
      </div>
    </Keyboard>
  </EngineProvider>
);

export default App;
