import React, { Component } from 'react';
import { Table, TableBody, TableRow, TableCell } from '@material-ui/core';
import { TableData } from './AgentExtensions.style';

class LoadingScreen extends Component {
  render() {
    return (
      <TableBody>
        <TableRow>
          <TableCell>
            <TableData>Loading...</TableData>
          </TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    );
  }
}

export default LoadingScreen;
