import { insertAtFirstBlank } from './helpers';
import apply from './operations';

const replaceInRow = (oldCard: Card, newCard: Maybe<Card>, row: Row): Row => ({
  ...row,
  left: row.left === oldCard ? newCard : row.left,
  right: row.right === oldCard ? newCard : row.right,
  result: row.result === oldCard ? newCard : row.result,
});

const replace = (oldCard: Maybe<Card>, newCard: Maybe<Card>, state: State): State =>
  oldCard || newCard
    ? {
        ...state,
        rows: oldCard ? state.rows.map((row) => replaceInRow(oldCard, newCard, row)) : state.rows,
        cards: oldCard ? state.cards.map((c) => (c?.id === oldCard.id ? newCard : c)) : state.cards,
      }
    : state;

const cards = (state: State): Card[] =>
  [...state.rows.flatMap(({ left, right }) => [left, right]), ...state.cards].filter(
    Boolean
  ) as Card[];

const makeAvailable = (card: Maybe<Card>, state: State): State => {
  if (!card || cards(state).some((c) => c.id === card.id)) return state;
  return { ...state, cards: insertAtFirstBlank(state.cards, card) };
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

    return row.result
      ? makeAvailable(newResult, replace(row.result, newResult, state))
      : newResult
      ? makeAvailable(newResult, {
          ...state,
          rows: state.rows.map((r) => (r === row ? { ...r, result: newResult } : r)),
        })
      : state;
  }, initial);

export default calculate;
