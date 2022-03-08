import { insertAtFirstBlank } from './helpers';

const apply: Record<Operator, (left: Maybe<number>, right: Maybe<number>) => Maybe<number>> = {
  plus: (left, right) => (left && right ? left + right : null),
  minus: (left, right) => (left && right && left > right ? left - right : null),
  times: (left, right) => (left && right && left !== 1 && right !== 1 ? left * right : null),
  divided: (left, right) =>
    left && right && right !== 1 && left % right === 0 ? left / right : null,
};

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

const makeAvailable = (card: Maybe<Card>, state: State): State =>
  card ? { ...state, cards: insertAtFirstBlank(state.cards, card) } : state;

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
