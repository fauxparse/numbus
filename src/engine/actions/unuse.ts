import calculate from './calculate';
import { insertAtFirstBlank } from './helpers';

const remove = (card: Maybe<Card>, state: State): State => {
  if (!card) return state;

  const { rows } = state;
  const { id } = card;
  const row = rows.find((r) => r.left?.id === id || r.right?.id === id);

  if (!row) return state;

  const side = row.left?.id === id ? 'left' : 'right';

  return remove(row.result, {
    ...state,
    rows: rows.map((r) => (r === row ? { ...r, [side]: null } : r)),
  });
};

const unuse = (action: Unuse, state: State): State => {
  if (!action.card) return state;

  const { id } = action.card;
  const row = state.rows.find((r) => r.left?.id === id || r.right?.id === id);

  if (!row) return state;

  const side = row.left?.id === id ? 'left' : 'right';

  const newState = {
    ...remove(row.result, state),
    cards: insertAtFirstBlank(state.cards, row[side]),
  };

  return calculate({
    ...newState,
    rows: newState.rows.map((r) => (r[side]?.id === id ? { ...r, [side]: null } : r)),
  });
};

export default unuse;
