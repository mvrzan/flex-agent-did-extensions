import React, { Component } from 'react';
import { TBody, Tr, Td } from '@twilio-paste/core';

class SyncEmpty extends Component {
  render() {
    return (
      <TBody>
        <Tr>
          <Td>There are no configured Agent extensions!</Td>
        </Tr>
      </TBody>
    );
  }
}

export default SyncEmpty;
