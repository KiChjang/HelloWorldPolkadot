import React, { useState, createRef } from 'react';
import { Container, Dimmer, Image, Loader, Grid, Sticky, Menu, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { DeveloperConsole } from './substrate-lib/components';

import AccountSelector from './AccountSelector';
import Balances from './Balances';
import BlockNumber from './BlockNumber';
import Events from './Events';
import Interactor from './Interactor';
import Metadata from './Metadata';
import NodeInfo from './NodeInfo';
import Transfer from './Transfer';
import ContractSelector from './ContractSelector';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const [contract, setContract] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div ref={contextRef}>
      <Sticky context={contextRef}>
        <Menu
          attached='top'
          tabular
          style={{
            backgroundColor: '#fff',
            borderColor: '#fff',
            paddingTop: '1em',
            paddingBottom: '1em'
          }}
        >
          <Container>
            <Menu.Menu>
              <Image src={`${process.env.PUBLIC_URL}/assets/substrate-logo.png`} size='mini' />
            </Menu.Menu>
            <ContractSelector setContract={setContract} />
            <AccountSelector setAccountAddress={setAccountAddress} />
          </Container>
        </Menu>
      </Sticky>
      <Container>
        <Grid stackable columns='equal'>
          <Grid.Row stretched>
            <NodeInfo />
            <Metadata />
            <BlockNumber />
            <BlockNumber finalized />
          </Grid.Row>
          <Grid.Row stretched>
            <Balances contract={contract} />
          </Grid.Row>
          <Grid.Row>
            <Transfer contract={contract} accountPair={accountPair} />
            <Events />
          </Grid.Row>
          <Grid.Row>
            <Interactor accountPair={accountPair} />
          </Grid.Row>
        </Grid>
      </Container>
      <DeveloperConsole />
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
