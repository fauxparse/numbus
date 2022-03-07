import { createReducerContext } from 'react-use';
import set from 'lodash/fp/set';
import last from 'lodash/fp/last';
import range from 'lodash/range';
import { isJust, isNothing, maybe, Maybe } from './maybe';
import { NumberSource } from '../components/Number';
import { apply, Operator } from './operators';

export interface Row {
  left: Maybe<number>;
  right: Maybe<number>;
  operator: Maybe<Operator>;
}

export type Slot = {
  number: Maybe<number>;
  source: NumberSource;
};

type PuzzleState = {
  givens: number[];
  rows: Row[];
  slots: Slot[];
  stock: Maybe<number>[];
  previousState: Maybe<PuzzleState>;
  nextState: Maybe<PuzzleState>;
  target: number;
};

export enum Verbs {
  Undo = 'undo',
  Redo = 'redo',
  ChangeOperator = 'operator',
  PlaceNumber = 'place',
  EraseNumber = 'erase',
}

type PuzzleUndo = {
  verb: Verbs.Undo;
};

type PuzzleRedo = {
  verb: Verbs.Redo;
};

type PuzzleChangeOperator = {
  verb: Verbs.ChangeOperator;
  row: number;
  operator: Maybe<Operator>;
};

type PuzzlePlaceNumber = {
  verb: Verbs.PlaceNumber;
  row: number;
  column: 'left' | 'right';
  slot: number;
  operator?: Operator;
};

type PuzzleEraseNumber = {
  verb: Verbs.EraseNumber;
  row: number;
  column: 'left' | 'right';
};

type PuzzleAction =
  | PuzzleUndo
  | PuzzleRedo
  | PuzzleChangeOperator
  | PuzzlePlaceNumber
  | PuzzleEraseNumber;

const emptyRow = (): Row => ({ left: null, operator: null, right: null });

export const emptyPuzzleState = (givens: number[], target: number): PuzzleState => {
  const slots = [...givens, ...new Array(5).fill(null)].map((number) => ({
    number,
    source: isJust(number) ? NumberSource.Given : NumberSource.Computed,
  }));

  return {
    givens,
    stock: range(givens.length),
    rows: [emptyRow()],
    slots,
    previousState: null,
    nextState: null,
    target,
  };
};

const isUndoAction = (action: PuzzleAction): action is PuzzleUndo => action.verb === Verbs.Undo;
const isRedoAction = (action: PuzzleAction): action is PuzzleRedo => action.verb === Verbs.Redo;
const isChangeOperatorAction = (action: PuzzleAction): action is PuzzleChangeOperator =>
  action.verb === Verbs.ChangeOperator;
const isPlaceNumberAction = (action: PuzzleAction): action is PuzzlePlaceNumber =>
  action.verb === Verbs.PlaceNumber;
const isEraseNumberAction = (action: PuzzleAction): action is PuzzleEraseNumber =>
  action.verb === Verbs.EraseNumber;

const undoable = (previousState: PuzzleState, newState: PuzzleState): PuzzleState => ({
  ...newState,
  previousState,
  nextState: null,
});

const isFullRow = (row: Row) => isJust(row.left) && isJust(row.right);

const recalculate = (state: PuzzleState): PuzzleState => {
  const newState = state.rows.reduce((accumulator, row, i) => {
    const {
      slots,
      givens: { length: givens },
      stock,
      target,
    } = accumulator;
    const slotIndex = i + givens;
    const { left, operator, right } = row;
    const result = apply(
      operator,
      maybe(isJust(left) ? slots[left]?.number : null),
      maybe(isJust(right) ? slots[right]?.number : null)
    );
    const newStock = [...stock];
    const index = newStock.indexOf(slotIndex);
    if (isJust(result)) {
      if (
        index < 0 &&
        !accumulator.rows.some((row) => row.left === slotIndex || row.right === slotIndex)
      ) {
        newStock[newStock.indexOf(null)] = slotIndex;
      }
    } else if (index > -1) {
      newStock[index] = null;
    }
    return {
      ...set(
        `slots[${i + givens}]`,
        {
          number: result,
          source: result === target ? NumberSource.Target : NumberSource.Computed,
        },
        accumulator
      ),
      stock: newStock,
    };
  }, state);
  return newState;
};

const reducer = (state: PuzzleState, action: PuzzleAction): PuzzleState => {
  if (isUndoAction(action)) {
    return state.previousState ? { ...state.previousState, nextState: state } : state;
  } else if (isRedoAction(action)) {
    return state.nextState ? { ...state.nextState, previousState: state } : state;
  } else if (isChangeOperatorAction(action)) {
    const newState = set(`rows[${action.row}].operator`, action.operator, state);
    if (action.row > 0 && isNothing(newState.rows[action.row].left)) {
      const previousRow = action.row - 1 + newState.givens.length;
      newState.rows[action.row].left = previousRow;
      newState.stock[newState.stock.indexOf(previousRow)] = null;
    }
    return undoable(state, recalculate(newState));
  } else if (isPlaceNumberAction(action) && action.row <= state.rows.length) {
    const stock = [...state.stock];
    stock[stock.indexOf(action.slot)] = null;
    const row = set(action.column, action.slot, state.rows[action.row]);
    if (action.column === 'right' && isJust(row.left) && isNothing(row.operator))
      row.operator = Operator.Add;
    const newState = recalculate(set(`rows[${action.row}]`, row, { ...state, stock }));
    if (isFullRow(last(newState.rows) as Row) && newState.rows.length < state.givens.length - 1) {
      if (newState.slots[action.row + newState.givens.length]?.number !== newState.target) {
        newState.rows.push(emptyRow());
      }
    }
    return undoable(state, newState);
  } else if (isEraseNumberAction(action)) {
    const stock = [...state.stock];
    stock[stock.indexOf(null)] = state.rows[action.row][action.column];
    const newState = set(`rows[${action.row}].${action.column}`, null, { ...state, stock });
    return undoable(state, recalculate(newState));
  }
  return state;
};

export const [usePuzzleReducer, PuzzleProvider] = createReducerContext(
  reducer,
  emptyPuzzleState([], 0)
);
