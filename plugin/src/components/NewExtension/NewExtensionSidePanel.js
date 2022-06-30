import React, { Component } from 'react';
import {
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from '@material-ui/core';
import { Button, SidePanel } from '@twilio/flex-ui-core';
import { Notifications } from '@twilio/flex-ui';
import {
  Container,
  AttributeTableCell,
  AttributeName,
  AttributeTextField,
  ButtonsContainer,
} from './NewExtension.styles';
import SyncHelper from '../utils/syncUtil';

class NewExtensionSidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agentName: '',
      agentExtension: '',
      workerSid: '',
      changed: false,
      stateAgentName: this.props.agentName,
    };
  }

  handleChange = e => {
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    let newState = { changed: true };
    newState[id] = value;
    this.setState(newState);
  };

  saveMapItem = async () => {
    const mapName = process.env.REACT_APP_SYNC_MAP_NAME;
    const agentName =
      this.state.agentName === '' ? this.props.agentName : this.state.agentName;
    const agentExtension =
      this.state.agentExtension === ''
        ? this.props.agentExt
        : this.state.agentExtension;
    const workerSid =
      this.state.workerSid === '' ? this.props.workerSid : this.state.workerSid;
    const mapKey = agentExtension;

    let mapValue = {
      workerFullName: agentName,
      extensionNumber: agentExtension,
      workerSid: workerSid,
    };

    // TODO: check if extension already exists

    await SyncHelper.updateMapItem(mapName, mapKey, mapValue);
    Notifications.showNotification('extensionUpdatedSuccessfully');

    // update syncEmpty state because sync is no longer empty
    this.props.syncEmpty;

    this.props.clickHandler();
    this.props.updateHandler();
  };

  render() {
    return (
      <SidePanel
        displayName="New Agent Extension"
        title={<div>New Agent Extension</div>}
        handleCloseClick={this.props.clickHandler}
      >
        <Container vertical>
          <Table>
            <TableHead>
              <TableRow>
                <AttributeTableCell>Attribute</AttributeTableCell>
                <TableCell>Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow key={`${this.props.agentName} agentName`}>
                <AttributeTableCell>
                  <AttributeName>Agent Name</AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField
                    id="agentName"
                    value={this.agentName}
                    defaultValue={this.props.agentName}
                    onChange={this.handleChange}
                    onClick={this.handleChange}
                    error={this.state.agentName === ''}
                  ></AttributeTextField>
                </TableCell>
              </TableRow>
              <TableRow key={`${this.props.agentExt} agentExtension`}>
                <AttributeTableCell>
                  <AttributeName>Agent Extension</AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField
                    id="agentExtension"
                    value={this.agentExtension}
                    defaultValue={this.props.agentExt}
                    onChange={this.handleChange}
                    onClick={this.handleChange}
                    error={
                      this.state.agentExtension === '' ||
                      isNaN(this.state.agentExtension)
                    }
                  ></AttributeTextField>
                </TableCell>
              </TableRow>
              <TableRow key={`${this.props.workerSid} workerSid`}>
                <AttributeTableCell>
                  <AttributeName>Worker SID</AttributeName>
                </AttributeTableCell>
                <TableCell>
                  <AttributeTextField
                    id="workerSid"
                    value={this.workerSid}
                    defaultValue={this.props.workerSid}
                    onChange={this.handleChange}
                    onClick={this.handleChange}
                    error={this.state.workerSid === ''}
                  ></AttributeTextField>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <ButtonsContainer>
            <Button onClick={this.props.clickHandler} roundCorners={false}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                this.saveMapItem();
                this.props.syncEmpty();
              }}
              roundCorners={false}
            >
              Save
            </Button>
          </ButtonsContainer>
        </Container>
      </SidePanel>
    );
  }
}

export default NewExtensionSidePanel;
