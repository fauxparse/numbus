import calculate from './calculate';

const operate = (action: Operate, state: State): State => {
  let card: Maybe<Card> = null;
  if (action.left) {
    card = state.cards.find((c) => c?.number === action.left) || null;
  } else if (action.row > 0) {
    const result = state.rows[action.row - 1].result;
    if (result && state.cards.includes(result)) {
      card = result;
    }
  }

  return calculate({
    ...state,
    rows: state.rows.map((row, i) =>
      i === action.row
        ? {
            ...row,
            operator: action.operator,
            left: card || row.left,
          }
        : row
    ),
    cards: state.cards.map((c) => (c === card ? null : c)),
  });
};

export default operate;
