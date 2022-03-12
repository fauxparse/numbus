import generate, { BIG_ONES, LITTLE_ONES } from '.';

describe('generate', () => {
  let state: State;

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-04-01').getTime());
  });

  describe('with a given seed', () => {
    beforeEach(() => (state = generate({ seed: 'Ggwcd7uE4C1t3FkiR' })));

    it('always generates the same puzzle', () => {
      expect(state.cards.map((c) => c?.number)).toEqual([100, 50, 2, 6, 5, 9]);
      expect(state.target).toEqual(334);
    });
  });

  describe('with no seed', () => {
    beforeEach(() => (state = generate()));

    it('has two big ones', () => {
      expect(state.cards.filter((c) => c && BIG_ONES.includes(c.number)).length).toBe(2);
    });

    it('has four little ones', () => {
      expect(state.cards.filter((c) => c && LITTLE_ONES.includes(c.number)).length).toBe(4);
    });

    it('generates a seed', () => {
      expect(state.seed).toEqual('b1bUN3UmaHATGuZFa');
    });
  });

  describe('with a different number of big ones', () => {
    beforeEach(() => (state = generate({ big: 4 })));

    it('has four big ones', () => {
      expect(state.cards.filter((c) => c && BIG_ONES.includes(c.number)).length).toBe(4);
    });

    it('has two little ones', () => {
      expect(state.cards.filter((c) => c && LITTLE_ONES.includes(c.number)).length).toBe(2);
    });

    it('generates a seed', () => {
      expect(state.seed).toEqual('WLRcpyuqxH3cePCLFn');
    });
  });
});
