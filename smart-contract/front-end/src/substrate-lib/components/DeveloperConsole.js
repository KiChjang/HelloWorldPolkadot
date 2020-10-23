// This component will simply add utility functions to your developer console.
import { useSubstrate } from '../';
import abi from '../../config/abi.json';

export default function DeveloperConsole (props) {
  const { api, apiState, keyring, keyringState } = useSubstrate();
  if (apiState === 'READY') { window.api = api; }
  if (keyringState === 'READY') { window.keyring = keyring; }
  window.util = require('@polkadot/util');
  window.utilCrypto = require('@polkadot/util-crypto');
  window.contract = require('@polkadot/api-contract');
  window.contractAbi = abi;

  return null;
}
