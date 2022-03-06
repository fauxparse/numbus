import React from 'react';
import { Verbs, usePuzzleReducer } from '../../util/state';

const Steps: React.FC = () => {
  const [state, dispatch] = usePuzzleReducer();

  const undo = () => dispatch({ verb: Verbs.Undo });

  const redo = () => dispatch({ verb: Verbs.Redo });

  return (
    <div>
      <button disabled={!state.previousState} onClick={undo}>
        Undo
      </button>
      <button disabled={!state.nextState} onClick={redo}>
        Redo
      </button>
    </div>
  );
};

export default Steps;
