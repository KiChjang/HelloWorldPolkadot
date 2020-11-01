#!/usr/bin/env node

const { ApiPromise, Keyring, WsProvider } = require('@polkadot/api');
const prompt = require('prompt-sync')({ sigint: true });

async function main() {
  const wsProvider = new WsProvider('ws://127.0.0.1:9944');
  const api = await ApiPromise.create({ provider: wsProvider });
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');
  const bob = keyring.addFromUri('//Bob');
  const charlie = keyring.addFromUri('//Charlie');
  const dave = keyring.addFromUri('//Dave');
  const eve = keyring.addFromUri('//Eve');
  const ferdie = keyring.addFromUri('//Ferdie');
  const accounts = [alice, bob, charlie, dave, eve, ferdie];

  console.log('The following accounts are available:');
  console.log('1) Alice');
  console.log('2) Bob');
  console.log('3) Charlie');
  console.log('4) Dave');
  console.log('5) Eve');
  console.log('6) Ferdie');
  const signerIndex = prompt('Who will be signing the transaction? Enter the number: ').trim();
  const signer = accounts[signerIndex - 1];
  const signatories = prompt('Enter the other signatories (numbers only, separate with comma): ')
    .split(',')
    .map(s => s.trim())
    .filter(s => s.length !== 0)
    .map(i => accounts[i - 1].address);
  const threshold = prompt('Enter approval threshold: ');
  const contents = prompt('Enter remark contents: ');
  const callHash = api.tx.system.remark(contents).toHex();
  const unsub = await api.tx.multisig
    .approveAsMulti(threshold, signatories, null, callHash, 0)
    .signAndSend(signer, ({ status }) => {
      console.info("Transaction status: " + status.type);
      if (status.isFinalized) {
        console.info("Block Hash: " + status.asFinalized.toString());
        process.exit(0);
      }
    })
    .catch(console.error);
  return unsub;
}

main().catch(console.error);
