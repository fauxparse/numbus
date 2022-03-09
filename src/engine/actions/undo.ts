export const undo = (_action: Undo, state: State): State =>
  state.previous ? { ...state.previous, next: state } : state;

export const undoable =
  <T>(fn: (action: T, state: State) => State) =>
  (action: T, state: State) =>
    addUndoState(fn(action, state), state);

const addUndoState = ({ next, ...state }: State, previous: State): State => ({
  ...state,
  step: state.step + 1,
  previous,
});

export default undo;
