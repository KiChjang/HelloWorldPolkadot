import React from 'react';
import { ContractPromise } from '@polkadot/api-contract';
import { decodeAddress, encodeAddress } from '@polkadot/keyring';
import { hexToU8a, isHex } from '@polkadot/util';
import abi from './config/abi.json';
import { useSubstrate } from './substrate-lib';

import {
  Menu,
  Input
} from 'semantic-ui-react';

export default function ContractSelector (props) {
  const { api } = useSubstrate();
  const { setContract } = props;

  const isValidPolkadotAddress = address => {
    try {
      encodeAddress(
        isHex(address)
          ? hexToU8a(address)
          : decodeAddress(address)
      );

      return true;
    } catch (error) {
      return false;
    }
  };

  const onChange = address => {
    // Update state with new contract address
    if (isValidPolkadotAddress(address)) {
      setContract(new ContractPromise(api, abi, address));
    }
  };

  return (
    <Menu.Menu position='left' style={{ alignItems: 'center' }}>
      <Input
        placeholder='Enter contract address'
        onChange={(_, input) => {
          onChange(input.value);
        }}
      />
    </Menu.Menu>
  );
}
