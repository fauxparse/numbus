import generate from '../generator';
import { solve } from '../solver';

const newGame = ({ action, ...options }: NewGame, _state?: State) => {
  while (true) {
    const game = generate(options);
    const solutions = Array.from(solve(game, { max: 1 }));
    if (solutions.length) return game;
  }
};

export default newGame;
