import React, { createContext, useCallback, useState } from 'react';
import Slider from './Slider';
import './Drawer.scss';
import { useLocalStorage } from 'react-use';
import Button from '../Button';
import { useEngine } from '../../engine';
import { useHotkeys } from 'react-hotkeys-hook';

type DrawerContextShape = {
  expanded: boolean;
  toggle: () => void;
};

export const DrawerContext = createContext<DrawerContextShape>({
  expanded: false,
  toggle: () => {},
});

const Drawer: React.FC = ({ children }) => {
  const engine = useEngine();

  const [expanded, setExpanded] = useState(false);

  const [bigOnes, setBigOnes] = useLocalStorage<number>('bigOnes', 2);

  const toggle = useCallback(() => {
    setExpanded((current) => !current);
  }, []);

  const newGameClicked = useCallback(() => {
    if (!engine.state) return;
    engine.newGame({ big: bigOnes });
    setExpanded(false);
  }, [engine, bigOnes]);

  useHotkeys('ctrl+n, command+n', newGameClicked, [engine, bigOnes]);

  return (
    <DrawerContext.Provider value={{ expanded, toggle }}>
      <div className="drawer__wrapper" aria-expanded={expanded || undefined}>
        <div className="drawer">
          {children}
          <aside className="drawer__content">
            <div className="drawer__form">
              <div className="how-to-play">
                <p>
                  Combine numbers using basic arithmetic operators{' '}
                  <span className="nobr">
                    (<code>+</code>, <code>–</code>, <code>&times;</code>, and <code>&divide;</code>
                    )
                  </span>{' '}
                  to reach the given target.
                </p>
                <p>
                  Each equation gives you a new number to use in subsequent rows. All numbers must
                  be positive integers (so you can’t use{' '}
                  <span className="nobr">
                    <code>5</code> <code>&divide;</code> <code>3</code>
                  </span>
                  , for example).
                </p>
                <p className="reference">
                  Based on the BBC TV show{' '}
                  <a
                    href="https://www.channel4.com/programmes/countdown"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Countdown
                  </a>
                  <br />
                  Made with 💖 by{' '}
                  <a href="https://github.com/fauxparse" target="_blank" rel="noopener noreferrer">
                    Matt Powell
                  </a>{' '}
                  (
                  <a href="https://twitter.com/fauxparse" target="_blank" rel="noopener noreferrer">
                    @fauxparse
                  </a>
                  )
                </p>
              </div>
              <Slider value={bigOnes || 2} onChange={setBigOnes} />
              <div className="drawer__buttons">
                <Button onClick={newGameClicked}>New game</Button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </DrawerContext.Provider>
  );
};

export default Drawer;
