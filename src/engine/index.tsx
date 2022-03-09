import { createContext, useContext, useReducer } from 'react';
import { perform } from './actions';
import generate from './generator';

type EngineContextShape =
  | { state: null }
  | {
      state: State;
      use: (action: Omit<Use, 'action'>) => void;
      operate: (action: Omit<Operate, 'action'>) => void;
      undo: () => void;
      redo: () => void;
    };

export const EngineContext = createContext<EngineContextShape>({ state: null });

const reducer = (state: Maybe<State>, action: Action): Maybe<State> =>
  state && perform(action, state);

export const EngineProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null, () => generate());

  const use = (action: Omit<Use, 'action'>) => dispatch({ action: 'use', ...action });

  const operate = (action: Omit<Operate, 'action'>) => dispatch({ action: 'operate', ...action });

  const undo = () => dispatch({ action: 'undo' });

  const redo = () => dispatch({ action: 'redo' });

  return (
    <EngineContext.Provider value={state ? { state, use, operate, undo, redo } : { state: null }}>
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => useContext(EngineContext);
