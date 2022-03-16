import actions from '../actions';

export const applyStep = (step: Step, state: State): State => {
  const rowIndex = state.rows.length - 1;

  let newState = state;
  let row = newState.rows[rowIndex];

  if (step.left !== row.left?.number) {
    const left = newState.cards.find((c) => c?.number === step.left) as Card;
    newState = actions.use({ row: rowIndex, side: 'left', card: left }, newState);
    row = newState.rows[rowIndex];
  }

  if (row.operator !== step.operator) {
    newState = actions.operate({ row: rowIndex, operator: step.operator }, newState);
    row = newState.rows[rowIndex];
  }

  if (step.right !== row.right?.number) {
    const right = newState.cards.find((c) => c?.number === step.right) as Card;
    newState = actions.use({ row: rowIndex, side: 'right', card: right }, newState);
  }

  return newState;
};
