import { Maybe } from './maybe';

export enum Operator {
  Add = 'add',
  Subtract = 'subtract',
  Multiply = 'multiply',
  Divide = 'divide',
}

export const OPERATORS = Object.values(Operator) as Operator[];

export type OperatorApplication = (left: Maybe<number>, right: Maybe<number>) => Maybe<number>;

const OPERATIONS: Record<Operator, OperatorApplication> = {
  [Operator.Add]: (left, right) => (left && right ? left + right : null),
  [Operator.Subtract]: (left, right) => (left && right && left !== right ? left - right : null),
  [Operator.Multiply]: (left, right) =>
    left && right && left !== 1 && right !== 1 ? left * right : null,
  [Operator.Divide]: (left, right) =>
    left && right && right !== 1 && left % right === 0 ? left / right : null,
};

export const apply = (
  operator: Operator,
  left: number | null,
  right: number | null
): number | null => OPERATIONS[operator](left, right);
