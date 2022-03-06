import React from 'react';
import Board from '../Board';
import Drawer from '../Drawer';
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
        <Drawer target={target} total={0} />
      </div>
    </PuzzleProvider>
  );
};

export default Puzzle;
