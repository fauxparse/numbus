import Header from './components/Header';
import Drawer from './components/Drawer';
import Puzzle from './components/Puzzle';
import { EngineProvider } from './engine';
import './App.scss';
import Keyboard from './Keyboard';
import Notices from './components/Notice/Notices';

const App = () => (
  <Notices>
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
  </Notices>
);

export default App;
