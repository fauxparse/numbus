import { insertAtFirstBlank } from './helpers';
import apply from './operations';

const replaceInRow = (oldCard: Card, newCard: Maybe<Card>, row: Row): Row => ({
  ...row,
  left: row.left === oldCard ? newCard : row.left,
  right: row.right === oldCard ? newCard : row.right,
  result:
    row.left === oldCard || row.right === oldCard
      ? null
      : row.result === oldCard
      ? newCard
      : row.result,
});

const replace = (oldCard: Maybe<Card>, newCard: Maybe<Card>, state: State): State => {
  if (!oldCard) return state;

  let newState = state;
  for (let i = 0; i < newState.rows.length; i++) {
    const row = newState.rows[i];
    const newRow = replaceInRow(oldCard as Card, newCard, row);
    newState = { ...newState, rows: newState.rows.map((r, j) => (j === i ? newRow : r)) };
    if (!newRow.result && row.result) newState = replace(row.result, null, newState);
  }
  return {
    ...newState,
    cards: oldCard
      ? newState.cards.map((c) => (c?.id === oldCard.id ? newCard : c))
      : newState.cards,
  };
};

const cards = (state: State): Card[] =>
  [...state.rows.flatMap(({ left, right }) => [left, right]), ...state.cards].filter(
    Boolean
  ) as Card[];

const makeAvailable = (card: Maybe<Card>, state: State): State => {
  if (!card || cards(state).some((c) => c.id === card.id)) return state;
  return { ...state, cards: insertAtFirstBlank(state.cards, card) };
};

const check = (state: State): State =>
  state.rows.find((row) => row.result?.number === state.target)
    ? { ...state, solved: true }
    : state;

const trim = (state: State): State => {
  const isEmpty = (row: Row): boolean => !row.left && !row.right;
  const firstEmptyRow = state.rows.findIndex(isEmpty);
  return firstEmptyRow > -1
    ? { ...state, rows: state.rows.slice(0, firstEmptyRow + (state.solved ? 0 : 1)) }
    : state;
};

const calculate = (initial: State): State =>
  initial.rows.reduce((state, row, index) => {
    const number =
      (row.left &&
        row.right &&
        row.operator &&
        apply[row.operator](row.left.number, row.right.number)) ||
      null;

    const newResult: Maybe<Card> = number
      ? {
          id: -index - 1,
          number,
          source: 'calculated',
        }
      : null;

    if (row.result?.number === newResult?.number) {
      return state;
    }

    return trim(
      check(
        row.result
          ? makeAvailable(newResult, replace(row.result, newResult, state))
          : newResult
          ? makeAvailable(newResult, {
              ...state,
              rows: state.rows.map((r) => (r === row ? { ...r, result: newResult } : r)),
            })
          : state
      )
    );
  }, initial);

export default calculate;
