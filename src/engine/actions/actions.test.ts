import { perform } from '.';
import { blankRow } from './helpers';

describe('actions', () => {
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
    };
  });

  describe('use', () => {
    describe('on an empty row', () => {
      beforeEach(() => {
        state = perform(
          { action: 'use', row: 0, side: 'left', card: state.cards[1] as Card },
          state
        );
      });

      it('adds the number into the row', () => {
        expect(state.rows[0].left).toEqual(
          expect.objectContaining({ id: 2, number: 50, source: 'given' })
        );
      });

      it('removes the card from the list of available cards', () => {
        expect(state.cards).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ number: 50 })])
        );
      });

      describe('placing the second number on the right hand side', () => {
        beforeEach(() => {
          state = perform({ action: 'use', row: 0, side: 'right', card: state.cards[2] }, state);
        });

        it('sets the operator to plus', () => {
          expect(state.rows[0].operator).toEqual('plus');
        });

        it('calculates the row value', () => {
          expect(state.rows[0].result?.number).toEqual(52);
        });

        it('makes the new number available', () => {
          expect(state.cards).toEqual(
            expect.arrayContaining([expect.objectContaining({ number: 52 })])
          );
        });

        it('inserts a new row', () => {
          expect(state.rows.length).toEqual(2);
        });
      });

      describe('placing the second number on the left hand side', () => {
        beforeEach(() => {
          state = perform({ action: 'use', row: 0, side: 'left', card: state.cards[2] }, state);
        });

        it('places the number', () => {
          expect(state.rows[0].left?.number).toEqual(2);
        });

        it('does not set the operator', () => {
          expect(state.rows[0].operator).toBe(null);
        });

        it('does not calculate the row value', () => {
          expect(state.rows[0].result).toBe(null);
        });

        it('does not insert a new row', () => {
          expect(state.rows.length).toEqual(1);
        });

        it('moves the old number out', () => {
          expect(state.cards).toEqual(
            expect.arrayContaining([expect.objectContaining({ number: 50 })])
          );
        });
      });

      describe('placing a blank on the left hand side', () => {
        beforeEach(() => {
          state = perform({ action: 'use', row: 0, side: 'left', card: null }, state);
        });

        it('clears the number', () => {
          expect(state.rows[0].left).toBe(null);
        });

        it('moves the old number out', () => {
          expect(state.cards).toEqual(
            expect.arrayContaining([expect.objectContaining({ number: 50 })])
          );
        });
      });
    });
  });

  describe('unuse', () => {
    beforeEach(() => {
      state = perform({ action: 'use', row: 0, side: 'left', card: state.cards[2] }, state);
      state = perform({ action: 'use', row: 0, side: 'right', card: state.cards[5] }, state);
      expect(state.cards).toEqual(
        expect.arrayContaining([expect.objectContaining({ number: 11 })])
      );
      state = perform({ action: 'unuse', card: state.rows[0].left }, state);
    });

    it('clears the result', () => {
      expect(state.rows[0].result).toBe(null);
      expect(state.cards).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ number: 11 })])
      );
    });

    it('returns the card', () => {
      expect(state.cards).toEqual(expect.arrayContaining([expect.objectContaining({ number: 2 })]));
    });
  });

  describe('operate', () => {
    beforeEach(() => {
      state = perform({ action: 'use', row: 0, side: 'left', card: state.cards[2] }, state);
      state = perform({ action: 'operate', row: 0, operator: 'times' }, state);
    });

    it('does not perform a calculation right away', () => {
      expect(state.rows[0].result).toBe(null);
    });

    describe('when the second number is placed', () => {
      beforeEach(() => {
        state = perform({ action: 'use', row: 0, side: 'right', card: state.cards[5] }, state);
      });

      it('calculates the row', () => {
        expect(state.rows[0].result).toEqual(expect.objectContaining({ number: 18 }));
      });

      it('creates a new card', () => {
        expect(state.cards).toEqual(
          expect.arrayContaining([expect.objectContaining({ number: 18 })])
        );
      });

      it('inserts a blank row', () => {
        expect(state.rows.length).toBe(2);
      });

      describe('and an operator is placed on the new row', () => {
        beforeEach(() => {
          state = perform({ action: 'operate', row: 1, operator: 'times' }, state);
        });

        it('copies the result from the previous row', () => {
          expect(state.rows[1].left).toBe(state.rows[0].result);
        });
      });
    });
  });

  describe('undo/redo', () => {
    beforeEach(() => {
      state = perform({ action: 'use', row: 0, side: 'left', card: state.cards[2] }, state);
      state = perform({ action: 'operate', row: 0, operator: 'times' }, state);
      state = perform({ action: 'use', row: 0, side: 'right', card: state.cards[5] }, state);
    });

    it('maintains an undo stack', () => {
      expect(state.previous).not.toBe(null);
    });

    describe('undoing', () => {
      beforeEach(() => {
        state = perform({ action: 'undo' }, state);
      });

      it('deletes the last placed number', () => {
        expect(state.rows[0].right).toBe(null);
      });

      it('deletes the extra row', () => {
        expect(state.rows.length).toBe(1);
      });

      it('is redoable', () => {
        expect(state.next).toBeDefined();
      });

      describe('and redoing again', () => {
        beforeEach(() => {
          state = perform({ action: 'redo' }, state);
        });

        it('adds back the extra row', () => {
          expect(state.rows.length).toBe(2);
        });
      });
    });
  });

  describe('solve', () => {
    describe('from a clean state', () => {
      beforeEach(() => {
        state = perform({ action: 'solve' }, state);
      });

      it('solves the puzzle', () => {
        expect(state.solved).toBe(true);
      });

      it('breaks down the steps', () => {
        expect(state.previous?.previous).not.toBeFalsy();
      });
    });
  });
});
