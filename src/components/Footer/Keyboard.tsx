import { useCallback, useEffect, useMemo, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { isJust, isNothing } from '../../util/maybe';
import { Operator } from '../../util/operators';
import { usePuzzleReducer, Verbs } from '../../util/state';

const Keyboard: React.FC = ({ children }) => {
  const [typed, setTyped] = useState(0);

  const [{ rows, stock, slots }, dispatch] = usePuzzleReducer();

  useEffect(() => {
    const prefix = typed.toString();
    const matching = stock.filter(
      (s) => isJust(s) && slots[s]?.number?.toString().startsWith(prefix)
    ) as number[];
    if (matching.length === 1) {
      const row =
        (rows.findIndex((r) => isNothing(r.left) || isNothing(r.right)) + rows.length + 1) %
        (rows.length + 1);
      const column = isJust(rows[row].left) ? 'right' : 'left';
      dispatch({ verb: Verbs.PlaceNumber, slot: matching[0], row, column });
      setTyped(0);
    }
  }, [typed, stock, slots, rows, dispatch]);

  useEffect(() => setTyped(0), [rows, stock, slots]);

  const addDigit = useCallback((e: KeyboardEvent) => {
    setTyped((current) => current * 10 + parseInt(e.key, 10));
  }, []);

  const backspace = useCallback(() => setTyped((current) => Math.floor(current / 10)), []);

  const operatorRow = useMemo(
    () =>
      (rows.findIndex((row) => isNothing(row.operator)) + 1 ||
        rows.findIndex((row) => isNothing(row.right)) + 1) - 1,
    [rows]
  );

  useHotkeys('0, 1, 2, 3, 4, 5, 6, 7, 8, 9', addDigit);

  useHotkeys('backspace', backspace);

  const dispatchOperator = useCallback(
    (operator) => {
      dispatch({ verb: Verbs.ChangeOperator, operator, row: operatorRow });
    },
    [dispatch, operatorRow]
  );

  const add = useCallback(() => dispatchOperator(Operator.Add), [dispatchOperator]);
  const subtract = useCallback(() => dispatchOperator(Operator.Subtract), [dispatchOperator]);
  const multiply = useCallback(() => dispatchOperator(Operator.Multiply), [dispatchOperator]);
  const divide = useCallback(() => dispatchOperator(Operator.Divide), [dispatchOperator]);

  useHotkeys('shift+=, num_add', add, [operatorRow]);
  useHotkeys('-, num_subtract', subtract, [operatorRow]);
  useHotkeys('shift+8, num_multiply', multiply, [operatorRow]);
  useHotkeys('/, num_divide', divide, [operatorRow]);

  return <div>{children}</div>;
};

export default Keyboard;
