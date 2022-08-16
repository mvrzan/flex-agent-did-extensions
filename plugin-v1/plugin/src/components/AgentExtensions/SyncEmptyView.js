import React, { Component } from 'react';
import { TableBody, TableRow, TableCell } from '@material-ui/core';

class SyncEmpty extends Component {
  render() {
    return (
      <TableBody>
        <TableRow>
          <TableCell>Sync map is empty</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    );
  }
}

export default SyncEmpty;
