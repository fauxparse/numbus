import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';
import { Statistic, useStatistics } from '../components/Stats';
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

const reducer = (state: Maybe<State>, action: Action): Maybe<State> => {
  if (!state) return null;
  const newState = perform(action, state);
  return { ...newState, stuck: action.action === 'solve' && newState.step === state.step };
};

export const EngineProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, null, () => generate());

  const use = useCallback(
    (action: Omit<Use, 'action'>) => dispatch({ action: 'use', ...action }),
    []
  );

  const unuse = useCallback(
    (action: Omit<Unuse, 'action'>) => dispatch({ action: 'unuse', ...action }),
    []
  );

  const operate = useCallback(
    (action: Omit<Operate, 'action'>) => dispatch({ action: 'operate', ...action }),
    []
  );

  const undo = useCallback(() => dispatch({ action: 'undo' }), []);

  const redo = useCallback(() => dispatch({ action: 'redo' }), []);

  const [, increment] = useStatistics();

  const newGame = useCallback(
    (options: GeneratorOptions = {}) => {
      if (state && !state.solved) {
        increment(Statistic.Abandoned);
      }
      dispatch({ action: 'new', ...options });
    },
    [state, increment]
  );

  useEffect(() => {
    if (state?.solved && !state.previous?.solved) {
      increment(state.hints ? Statistic.Assisted : Statistic.Solo);
    }
  }, [state, increment]);

  const solve = useCallback(() => dispatch({ action: 'solve' }), []);

  const hint = useCallback(() => dispatch({ action: 'solve', steps: 1 }), []);

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
