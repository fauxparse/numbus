import React, { useMemo } from 'react';
import last from 'lodash/last';
import { isJust, maybe, Maybe } from '../../util/maybe';
import { usePuzzleReducer } from '../../util/state';
import Stock from '../Stock';
import Target, { TargetProps } from '../Target';
import './Footer.scss';

export type FooterProps = Omit<TargetProps, 'total'>;

const Footer: React.FC<FooterProps> = ({ target }) => {
  const [{ slots, givens }] = usePuzzleReducer();

  const closest = useMemo<Maybe<number>>(() => {
    return maybe(
      last(
        slots
          .slice(givens.length)
          .map((slot) => maybe(slot?.number))
          .filter(isJust)
      )
    );
  }, [givens, slots]);

  return (
    <footer className="footer">
      <Stock />
      <Target target={target} total={closest} />
    </footer>
  );
};

export default Footer;