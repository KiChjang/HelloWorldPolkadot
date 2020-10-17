#!/usr/bin/env node

const { ApiPromise, WsProvider } = require('@polkadot/api');
const yargs = require('yargs/yargs');

const options = yargs(process.argv.slice(2))
  .usage('Usage: blockinfo [-s <blockno>]')
  .option('search', {
    alias: 's',
    description: 'Display block information associated with the specified block number instead',
    type: 'number'
  })
  .help()
  .alias('help', 'h')
  .argv;

async function main() {
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  const hash = options.search
    ? await api.rpc.chain.getBlockHash(options.search)
    : await api.rpc.chain.getFinalizedHead();
  const body = await api.rpc.chain.getBlock(hash);

  console.info(JSON.stringify(body, null, 2));
}

main().then(() => process.exit(0)).catch(console.error);
