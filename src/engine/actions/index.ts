import use from './use';
import unuse from './unuse';
import operate from './operate';
import undo, { undoable } from './undo';
import redo from './redo';
import newGame from './newGame';

const actions: Record<Action['action'], any> = {
  use: undoable(use),
  unuse: undoable(unuse),
  operate: undoable(operate),
  undo,
  redo,
  new: newGame,
};

export const perform = (action: Action, state: State): State =>
  actions[action.action](action, state);

export default actions;
