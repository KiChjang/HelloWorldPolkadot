import React, { useEffect, useState } from 'react';
import { Statistic, Grid, Card, Icon } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { api } = useSubstrate();
  let [blockNumber, setBlockNumber] = useState(0);
  const [blockNumberTimer, setBlockNumberTimer] = useState(0);

  if (props.setBlockNumber) {
    blockNumber = props.blockNumber;
    setBlockNumber = props.setBlockNumber;
  }

  const bestNumber = props.setBlockNumber
    ? api.derive.chain.bestNumber
    : api.derive.chain.bestNumberFinalized;

  useEffect(() => {
    let unsubscribeAll = null;

    bestNumber(number => {
      setBlockNumber(number.toNumber());
      setBlockNumberTimer(0);
    })
      .then(unsub => {
        unsubscribeAll = unsub;
      })
      .catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [bestNumber]);

  const timer = () => {
    setBlockNumberTimer(time => time + 1);
  };

  useEffect(() => {
    const id = setInterval(timer, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Grid.Column>
      <Card>
        <Card.Content textAlign='center'>
          <Statistic
            label={(props.setBlockNumber ? 'Current' : 'Finalized') + ' Block'}
            value={blockNumber}
          />
        </Card.Content>
        <Card.Content extra>
          <Icon name='time' /> {blockNumberTimer}
        </Card.Content>
      </Card>
    </Grid.Column>
  );
}

export default function BlockNumber (props) {
  const { api } = useSubstrate();
  return api.derive &&
    api.derive.chain &&
    api.derive.chain.bestNumber &&
    api.derive.chain.bestNumberFinalized ? (
      <Main {...props} />
    ) : null;
}
