import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Main (props) {
  const { api } = useSubstrate();
  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ threshold: 0, signatories: '', contents: '' });
  const { accountPair } = props;

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { threshold, signatories, contents } = formState;

  return (
    <Grid.Column width={8}>
      <h1>Multisig Remark</h1>
      <Form>
        <Form.Field>
          <Input
            fluid
            label='Threshold'
            type='number'
            placeholder='threshold'
            state='threshold'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Other Signatories (separate with comma)'
            type='text'
            state='signatories'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Remark'
            type='text'
            state='remark'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'multisig',
              callable: 'asMulti',
              inputParams: [threshold, signatories.split(','), null, api.tx.system.remark(contents), false, 10000000],
              paramFields: [true, true, { optional: true }, true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
