import React, { useEffect, useState } from 'react';
import { Table, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';

export default function Main (props) {
  const { api } = useSubstrate();
  const { blockNumber } = props;
  const [block, setBlock] = useState({});

  useEffect(() => {
    const getBlock = async () => {
      try {
        const hash = await api.rpc.chain.getBlockHash(blockNumber);
        const { block } = await api.rpc.chain.getBlock(hash);
        console.info(block);
        setBlock(block);
      } catch (e) {
        console.error(e);
      }
    };
    getBlock();
  }, [api, blockNumber]);

  return (
    <Grid.Column>
      <h1>Block Info</h1>
      <Table celled striped size='small'>
        <Table.Body>
          <Table.Row>
            <Table.Cell width={3} textAlign='right'>Block Number</Table.Cell>
            <Table.Cell width={10}>{blockNumber}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='right'>Parent Hash</Table.Cell>
            <Table.Cell width={10}>{block.header && block.header.parentHash.toString()}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='right'>State Root</Table.Cell>
            <Table.Cell width={10}>{block.header && block.header.stateRoot.toString()}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='right'>Extrinsics Root</Table.Cell>
            <Table.Cell width={10}>{block.header && block.header.extrinsicsRoot.toString()}</Table.Cell>
          </Table.Row>
          <Table.Row>
            <Table.Cell width={3} textAlign='right'>Digest</Table.Cell>
            <Table.Cell width={10}>{block.header && JSON.stringify(block.header.digest)}</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table>
    </Grid.Column>
  );
}
