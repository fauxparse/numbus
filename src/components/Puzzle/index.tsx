import React from 'react';
import Board from '../Board';
import Footer from '../Footer';
import { PuzzleProvider, emptyPuzzleState } from '../../util/state';
import Steps from './Steps';
import './Puzzle.scss';

interface PuzzleProps {
  givens: number[];
  target: number;
}

const Puzzle: React.FC<PuzzleProps> = ({ givens, target }) => {
  return (
    <PuzzleProvider initialState={emptyPuzzleState(givens, target)}>
      <div className="puzzle">
        <Board />
        <Steps />
        <Footer target={target} />
      </div>
    </PuzzleProvider>
  );
};

export default Puzzle;
