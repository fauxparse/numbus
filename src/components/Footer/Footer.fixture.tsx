import React from 'react';
import Footer from '.';
import Target from '../Target';

//[100, 50, 2, 6, 5, 9]
export default (
  <Footer
    cards={[
      { id: 1, number: 100, source: 'given' },
      { id: 2, number: 50, source: 'given' },
      { id: -1, number: 18, source: 'calculated' },
      { id: 4, number: 6, source: 'given' },
      { id: 5, number: 5, source: 'given' },
      null,
    ]}
  >
    <Target target={123} total={null} />
  </Footer>
);
