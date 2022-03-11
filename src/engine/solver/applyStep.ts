import actions from '../actions';

export const applyStep = (step: Step, state: State): State => {
  const row = state.rows.length - 1;
  const left = state.cards.find((c) => c?.number === step.left) as Card;
  const right = state.cards.find((c) => c?.number === step.right && c !== left) as Card;

  return actions.use(
    { row, side: 'right', card: right },
    actions.operate(
      { operator: step.operator, row },
      actions.use({ row, side: 'left', card: left }, state)
    )
  );
};
