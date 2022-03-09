import sortBy from 'lodash/fp/sortBy';
import OPERATIONS from '../actions/operations';
import toPairs from 'lodash/fp/toPairs';
import priorityQueue from './priorityQueue';

type SolutionNode = { left: number; right: number; rest: number[] };

type SolveOptions = {
  max?: number;
};

const OPERATORS = toPairs(OPERATIONS) as [
  Operator,
  (left: Maybe<number>, right: Maybe<number>) => Maybe<number>
][];

const numbersOf = (state: State): number[] =>
  sortBy([(n) => -n], state.cards.map((c) => c?.number).filter(Boolean) as number[]);

function* pairs(numbers: number[]): Generator<SolutionNode> {
  for (let i = 0; i < numbers.length - 1; i++) {
    for (let j = i + 1; j < numbers.length; j++) {
      if (i === j) continue;
      const { [i]: left, [j]: right, ...rest } = numbers;
      yield { left, right, rest: Object.values(rest) };
    }
  }
}

function* operations(left: number, right: number): Generator<Step> {
  for (const [operator, operation] of OPERATORS) {
    const result = operation(left, right);
    if (result) yield { operator, left: left, right: right, result };
  }
}

export function* solve(initialState: State, options: SolveOptions = {}): Generator<Solution> {
  const max = options.max || Infinity;
  const open = priorityQueue<{ steps: Step[]; numbers: number[] }>();
  const { cards, target } = initialState;
  const numbers = sortBy([(n) => -n], cards.map((c) => c?.number).filter(Boolean) as number[]);
  open.insert({ steps: [], numbers }, target);
  const closed = new Set<string>();

  let n = 0;

  while (!open.isEmpty() && n < max) {
    const current = open.pop();
    if (!current) break;

    for (const { left, right, rest } of pairs(current?.numbers)) {
      for (const step of operations(left, right)) {
        if (step.result === target) {
          yield { steps: [...current.steps, step] };
          n += 1;
        } else if (rest.length > 1) {
          const numbers = [step.result, ...rest];
          const key = numbers.join(',');
          if (!closed.has(key)) {
            closed.add(key);
            open.insert(
              { steps: [...current.steps, step], numbers },
              (step.result - target) * (step.result - target)
            );
          }
        }
      }
    }
  }
}
