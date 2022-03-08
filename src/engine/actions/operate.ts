import calculate from './calculate';

const operate = (action: Operate, state: State): State =>
  calculate({
    ...state,
    rows: state.rows.map((row, i) =>
      i === action.row ? { ...row, operator: action.operator } : row
    ),
  });

export default operate;
