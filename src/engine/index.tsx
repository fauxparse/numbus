import { createContext, useContext, useReducer } from 'react';
import { perform } from './actions';
import generate from './generator';

type EngineContextShape =
  | { state: null }
  | {
      state: State;
      use: (action: Omit<Use, 'action'>) => void;
      unuse: (action: Omit<Unuse, 'action'>) => void;
      operate: (action: Omit<Operate, 'action'>) => void;
      undo: () => void;
      redo: () => void;
      newGame: (options?: GeneratorOptions) => void;
      solve: () => void;
      hint: () => void;
    };

export const EngineContext = createContext<EngineContextShape>({ state: null });

const reducer = (state: Maybe<State>, action: Action): Maybe<State> =>
  state && perform(action, state);

export const EngineProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null, () => generate());

  const use = (action: Omit<Use, 'action'>) => dispatch({ action: 'use', ...action });

  const unuse = (action: Omit<Unuse, 'action'>) => dispatch({ action: 'unuse', ...action });

  const operate = (action: Omit<Operate, 'action'>) => dispatch({ action: 'operate', ...action });

  const undo = () => dispatch({ action: 'undo' });

  const redo = () => dispatch({ action: 'redo' });

  const newGame = (options: GeneratorOptions = {}) => dispatch({ action: 'new', ...options });

  const solve = () => dispatch({ action: 'solve' });

  const hint = () => dispatch({ action: 'solve', steps: 1 });

  return (
    <EngineContext.Provider
      value={
        state ? { state, use, unuse, operate, undo, redo, newGame, solve, hint } : { state: null }
      }
    >
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => useContext(EngineContext);
