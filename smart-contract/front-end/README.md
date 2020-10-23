# Substrate Front End Template

## Usage

```bash
yarn
yarn start
```

## Interaction with the ERC20 contract
You must supply the contract address to the input box at the top left hand corner of the UI.

This front-end piece does not have the UI component to deploy a contract. It is recommended to use [Polkadot Apps](https://polkadot.js.org/apps) to do so.

Once that is done, the Balances component should have a new column populated with the token balances for each account, and the Transfer component should allow you to start making token transfers. Note that the token balances are not updated in real time; once the token transfer transaction is finalized on the blockchain, you'll need to refresh the page in order to see the changes.
