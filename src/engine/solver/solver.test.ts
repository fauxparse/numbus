import { applyStep } from './applyStep';
import { blankRow } from '../actions/helpers';
import { solve } from '.';

describe('solve', () => {
  let state: State;

  beforeEach(() => {
    state = {
      seed: 'Ggwcd7uE4C1t3FkiR',
      step: 0,
      rows: [blankRow()],
      cards: [
        { id: 1, number: 100, source: 'given' },
        { id: 2, number: 50, source: 'given' },
        { id: 3, number: 2, source: 'given' },
        { id: 4, number: 6, source: 'given' },
        { id: 5, number: 5, source: 'given' },
        { id: 6, number: 9, source: 'given' },
      ] as Card[],
      target: 334,
      solved: false,
      hints: 0,
    };
  });

  describe('applyStep', () => {
    it('applies the step to the state', () => {
      state = applyStep({ left: 9, right: 2, operator: 'times', result: 18 }, state);
      expect(state.cards).toEqual(
        expect.arrayContaining([expect.objectContaining({ number: 18 })])
      );
      expect(state.cards).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ number: 9 })])
      );
      expect(state.cards).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ number: 2 })])
      );
    });
  });

  describe('solve', () => {
    it('solves the puzzle', () => {
      const solutions = Array.from(solve(state));
      expect(solutions.length).toBe(8);
    });

    it('limits solutions', () => {
      const solutions = Array.from(solve(state, { max: 1 }));
      expect(solutions.length).toBe(1);
    });
  });
});
