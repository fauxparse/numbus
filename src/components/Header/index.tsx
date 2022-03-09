import { useContext } from 'react';
import { useEngine } from '../../engine';
import { DrawerContext } from '../Drawer';
import './Header.scss';

const Header: React.FC = () => {
  const { expanded, toggle } = useContext(DrawerContext);

  const engine = useEngine();

  const { state } = engine;

  return (
    <header className="header">
      <h1>Numbus</h1>
      <button
        className="menu-button"
        aria-label="Menu"
        aria-pressed={expanded || undefined}
        onClick={toggle}
      >
        <svg viewBox="-12 -12 24 24">
          <g>
            <circle cx={0} cy={0} r={4} />
            <circle cx={0} cy={0} r={4} />
            <circle cx={0} cy={0} r={4} />
          </g>
        </svg>
      </button>
      {state !== null && (
        <div className="header__buttons">
          <button aria-label="Undo" disabled={!state.previous} onClick={engine.undo}>
            <svg viewBox="0 0 24 24">
              <path
                d="M2.474 10.339a6.859 6.859 0 0 1-.105.154c-.244.436-.373.971-.369 1.518a2.96 2.96 0 0 0 .341 1.418c.15.259.311.507.483.739 1.67 2.16 3.582 3.945 5.666 5.288.419.264.864.448 1.32.544h.057c.666-.008 1.274-.519 1.576-1.323.15-.576.264-1.168.341-1.769.029-.304.054-.608.077-.913.046.004.092.005.139.005a9.965 9.965 0 0 1 6.801 2.669c1.15 1.067 3.199.9 3.199-.669 0-5.523-4.477-10-10-10l-.141.001a43.06 43.06 0 0 0-.102-1.085c-.066-.48-.152-.956-.257-1.424-.16-.508-.44-.93-.795-1.2A1.567 1.567 0 0 0 9.81 4a3.82 3.82 0 0 0-1.179.448c-2.133 1.35-4.09 3.163-5.793 5.364-.132.18-.27.386-.364.527Z"
                fill="#06B6D4"
              />
            </svg>
          </button>
          <button aria-label="Redo" disabled={!state.next} onClick={engine.redo}>
            <svg viewBox="0 0 24 24">
              <path
                d="M21.526 10.339c.049.072.086.128.105.154.244.436.373.971.369 1.518a2.96 2.96 0 0 1-.341 1.418 7.75 7.75 0 0 1-.483.739c-1.67 2.16-3.582 3.945-5.666 5.288a4.041 4.041 0 0 1-1.32.544h-.057c-.666-.008-1.274-.519-1.576-1.323a14.204 14.204 0 0 1-.341-1.769 49.507 49.507 0 0 1-.077-.913A2.073 2.073 0 0 1 12 16a9.965 9.965 0 0 0-6.801 2.669C4.049 19.736 2 19.569 2 18 2 12.477 6.477 8 12 8l.141.001c.03-.362.064-.724.102-1.085.066-.48.152-.956.257-1.424.16-.508.44-.93.795-1.2.277-.192.584-.292.895-.292.405.079.802.23 1.179.448 2.133 1.35 4.09 3.163 5.793 5.364.132.18.27.386.364.527Z"
                fill="#06B6D4"
              />
            </svg>
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
