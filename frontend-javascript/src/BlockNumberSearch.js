import React from 'react';

import {
  Menu,
  Input,
  Container,
  Image
} from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  return (
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
        <Menu.Menu position='right' style={{ alignItems: 'center' }}>
          <Input icon='search' placeholder='Search...' />
        </Menu.Menu>
      </Container>
    </Menu>
  );
}

export default function BlockNumberSearch (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
