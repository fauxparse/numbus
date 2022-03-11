import generate from '../generator';

const newGame = ({ action, ...options }: NewGame, _state?: State) => generate(options);

export default newGame;
