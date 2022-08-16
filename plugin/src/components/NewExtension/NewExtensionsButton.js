import React, { Component } from 'react';
import { Button } from '@twilio-paste/core';

class NewExtButton extends Component {
  constructor(props) {
    super();
  }
  render() {
    return (
      <Button variant="outlined" onClick={this.props.clickHandler}>
        Add New Extension
      </Button>
    );
  }
}

export default NewExtButton;
