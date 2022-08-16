import React, { Component } from 'react';
import { TBody, Th, Tr } from '@twilio-paste/core';
import { TableData } from './AgentExtensions.style';

class LoadingScreen extends Component {
  render() {
    return (
      <TBody>
        <Tr>
          <Th>
            <TableData>Loading...</TableData>
          </Th>
          <Th></Th>
          <Th></Th>
          <Th></Th>
        </Tr>
      </TBody>
    );
  }
}

export default LoadingScreen;
