export const undo = (_action: Undo, state: State): State => {
  return state.previous ? { ...state.previous, next: state, hints: state.hints } : state;
};

export const undoable =
  <T>(fn: (action: T, state: State) => State) =>
  (action: T, state: State) =>
    state.solved ? state : addUndoState(fn(action, state), state);

export const addUndoState = ({ next, ...state }: State, previous: State): State => ({
  ...state,
  step: state.step + 1,
  previous,
});

export default undo;
