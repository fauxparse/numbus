import operate from '../actions/operate';
import { undoable } from '../actions/undo';
import use from '../actions/use';

export const applyStep = undoable((step: Step, state: State): State => {
  const row = state.rows.length - 1;
  const left = state.cards.find((c) => c?.number === step.left) as Card;
  const right = state.cards.find((c) => c?.number === step.right && c !== left) as Card;
  return operate(
    { action: 'operate', operator: step.operator, row },
    use(
      { action: 'use', row, side: 'left', card: left },
      use({ action: 'use', row, side: 'right', card: right }, state)
    )
  );
});
