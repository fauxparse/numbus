import last from 'lodash/fp/last';
import calculate from './calculate';
import { blankRow } from './helpers';
import unuse from './unuse';

const use = (action: Use, state: State): State => {
  const cleared = unuse({ action: 'unuse', card: state.rows[action.row][action.side] }, state);

  if (!action.card) return cleared;

  const newState = calculate({
    ...cleared,
    rows: cleared.rows.map((row, index) =>
      index === action.row
        ? {
            ...row,
            [action.side]: action.card,
            operator:
              row.operator ||
              ((action.side === 'left' && !!row.right) || (action.side === 'right' && !!row.left)
                ? 'plus'
                : null),
          }
        : row
    ),
    cards: cleared.cards.map((card) => (card?.id === action.card?.id ? null : card)),
  });
  if (last(newState.rows)?.result && !newState.solved) {
    return {
      ...newState,
      rows: [...newState.rows, blankRow()],
    };
  }
  return newState;
};

export default use;
