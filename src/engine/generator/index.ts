import seedrandom from 'seedrandom';
import Hashids from 'hashids';
import { blankRow } from '../actions/helpers';

export const BIG_ONES = [25, 50, 75, 100];
export const LITTLE_ONES = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

export const hashids = new Hashids(
  'NUMBUS',
  4,
  'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789'
);

const generate = (options: GeneratorOptions = {}): State => {
  let { big = 2, seed } = options;
  let target: number = 0;
  let numbers: number[] = [];

  if (seed) {
    const decoded = hashids.decode(seed);
    if (decoded) {
      [target, ...numbers] = decoded as number[];
    }
  } else {
    const rng = seedrandom(new Date().valueOf().toString());
    target = Math.floor(rng() * 900) + 100;
    const bigNumbers = [...BIG_ONES];
    const littleNumbers = [...LITTLE_ONES];
    numbers = new Array(6).fill(0).flatMap((_, i) => {
      const list = i < big ? bigNumbers : littleNumbers;
      return list.splice(Math.floor(rng() * list.length), 1);
    });
    seed = hashids.encode([target, ...numbers]);
  }

  const cards = numbers.map((number, i): Card => ({ id: i, number, source: 'given' }));

  return { seed, cards, target, step: 0, rows: [blankRow()], solved: false, hints: 0 };
};

export default generate;
