import { solve } from '../solver';
import { applyStep } from '../solver/applyStep';
import operate from './operate';
import unuse from './unuse';

const clearPartialRows = (state: State): State => {
  let newState = state;
  for (let i = 0; i < newState.rows.length; i++) {
    const row = newState.rows[i];
    if (row.left && row.right) continue;
    if (row.left) newState = unuse({ action: 'unuse', card: row.left }, newState);
    if (row.right) newState = unuse({ action: 'unuse', card: row.right }, newState);
    if (row.operator) newState = operate({ action: 'operate', operator: null, row: i }, newState);
  }
  return newState;
};

const solveAction = ({ steps: max = -1 }: Solve, state: State): State => {
  for (const solution of solve(clearPartialRows(state), { max: 1 })) {
    if (!solution.steps.length) continue;
    const steps = max > 0 ? solution.steps.slice(0, max) : solution.steps;
    return steps.reduce((accumulator, step) => applyStep(step, accumulator), state);
  }
  return state;
};

export default solveAction;
