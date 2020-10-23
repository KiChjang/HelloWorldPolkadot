import React, { useEffect, useState } from 'react';
import { Table, Grid, Button } from 'semantic-ui-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useSubstrate } from './substrate-lib';

export default function Main (props) {
  const { api, keyring } = useSubstrate();
  const { contract } = props;
  const accounts = keyring.getPairs();
  const [balances, setBalances] = useState({});

  useEffect(() => {
    const addresses = keyring.getPairs().map(account => account.address);
    let unsubscribeAll = null;

    if (contract !== null) {
      for (const address of addresses) {
        contract.query
          .balanceOf(address, 0, -1, address)
          .then(callValue => {
            if (callValue.result.isSuccess) {
              setBalances(state => {
                return {
                  ...state,
                  [address]: {
                    ...state[address],
                    coin: callValue.output.toHuman()
                  }
                };
              });
            }
          })
          .then(unsub => {
            console.info(unsub);
          })
          .catch(console.error);
      }
    }

    api.query.system.account
      .multi(addresses, balances => {
        addresses.forEach((address, index) => {
          setBalances(state => {
            return {
              ...state,
              [address]: {
                ...state[address],
                main: balances[index].data.free.toHuman()
              }
            };
          });
        });
      }).then(unsub => {
        unsubscribeAll = unsub;
      }).catch(console.error);

    return () => unsubscribeAll && unsubscribeAll();
  }, [api, contract, keyring, setBalances]);

  return (
    <Grid.Column>
      <h1>Balances</h1>
      <Table celled striped size='small'>
        <Table.Body>{accounts.map(account =>
          <Table.Row key={account.address}>
            <Table.Cell width={3} textAlign='right'>{account.meta.name}</Table.Cell>
            <Table.Cell width={7}>
              <span style={{ display: 'inline-block', minWidth: '31em' }}>
                {account.address}
              </span>
              <CopyToClipboard text={account.address}>
                <Button
                  basic
                  circular
                  compact
                  size='mini'
                  color='blue'
                  icon='copy outline'
                />
              </CopyToClipboard>
            </Table.Cell>
            <Table.Cell width={2}>{
              balances && balances[account.address] &&
              balances[account.address].main
            }</Table.Cell>
            <Table.Cell width={2}>{
              balances && balances[account.address] &&
              balances[account.address].coin
            }</Table.Cell>
          </Table.Row>
        )}
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
