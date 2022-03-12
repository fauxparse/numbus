import React from 'react';
import Button from '../Button';
import Notices, { useNotices } from './Notices';

const NoticesFixture: React.FC = () => {
  const notify = useNotices();
  return (
    <Button
      onClick={() =>
        notify({
          title: 'Aw fuck',
          children: <p>Looks like you messed it up, egg.</p>,
          buttons: { again: 'Start over' },
        }).then(console.log)
      }
    >
      Fuck it up
    </Button>
  );
};

export default (
  <Notices>
    <NoticesFixture />
  </Notices>
);
