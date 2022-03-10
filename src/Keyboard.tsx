import React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import uniq from 'lodash/fp/uniq';
import { useEngine } from './engine';
import { isJust, isNothing } from './util/maybe';

const Keyboard: React.FC = ({ children }) => {
  const [typed, setTyped] = useState(0);

  const engine = useEngine();

  const { state } = engine;

  useEffect(() => setTyped(0), [state]);

  const addDigit = useCallback((e: KeyboardEvent) => {
    setTyped((current) => current * 10 + parseInt(e.key, 10));
  }, []);

  const backspace = useCallback(() => setTyped((current) => Math.floor(current / 10)), []);

  const playCard = useCallback(
    (card: Card) => {
      if (!state) return;
      const row =
        (state.rows.findIndex((r) => isNothing(r.left) || isNothing(r.right)) +
          state.rows.length +
          1) %
        (state.rows.length + 1);
      const side = isJust(state.rows[row].left) ? 'right' : 'left';
      engine.use({ card, row, side });
      setTyped(0);
    },
    [state, engine]
  );

  const enter = useCallback(() => {
    if (!state) return;
    console.log('enter', typed);
    const card = state.cards.find((c) => c?.number === typed);
    if (card) playCard(card);
  }, [state, typed, playCard]);

  useEffect(() => {
    if (!state || !engine.use) return;

    const prefix = typed.toString();

    const matching = state.cards.filter(
      (card) => isJust(card) && card.number?.toString().startsWith(prefix)
    ) as Card[];

    if (uniq(matching.map((c) => c.number)).length === 1 && matching[0].number === typed) {
      playCard(matching[0]);
    }
  }, [state, engine, typed, playCard]);

  const changeOperator = useCallback(
    (operator: Operator) => {
      if (!state) return;

      const row = state.rows.findIndex((row) => isNothing(row.operator));

      if (row > -1) engine.operate({ row, operator, left: typed });
    },
    [state, engine, typed]
  );

  const add = useCallback(() => changeOperator('plus'), [changeOperator]);
  const subtract = useCallback(() => changeOperator('minus'), [changeOperator]);
  const multiply = useCallback(() => changeOperator('times'), [changeOperator]);
  const divide = useCallback(() => changeOperator('divided'), [changeOperator]);

  const undo = useCallback(() => {
    if (state) engine.undo();
  }, [engine, state]);

  const redo = useCallback(() => {
    if (state) engine.redo();
  }, [engine, state]);

  useHotkeys('0, 1, 2, 3, 4, 5, 6, 7, 8, 9', addDigit);
  useHotkeys('backspace', backspace);
  useHotkeys('enter', enter, [typed]);

  useHotkeys('shift+=, num_add', add, [state, typed]);
  useHotkeys('-, num_subtract', subtract, [state, typed]);
  useHotkeys('shift+8, num_multiply', multiply, [state, typed]);
  useHotkeys('/, num_divide', divide, [state, typed]);

  useHotkeys('ctrl+z, command+z', undo, [state]);
  useHotkeys('ctrl+shift+z, command+shift+z', redo, [state]);

  return <>{children}</>;
};

export default Keyboard;
