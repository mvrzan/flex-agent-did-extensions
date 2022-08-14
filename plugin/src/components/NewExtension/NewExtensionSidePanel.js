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
import { Manager } from '@twilio/flex-ui';
import {
  Container,
  AttributeTableCell,
  AttributeName,
  AttributeTextField,
  ButtonsContainer,
} from './NewExtension.styles';
import SyncHelper from '../utils/syncUtil';

import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import { debounce } from 'lodash';
import InputLabel from '@material-ui/core/InputLabel';

const SYNC_CLIENT = Manager.getInstance();

class NewExtensionSidePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agentName: '',
      agentExtension: '',
      workerSid: '',
      changed: false,
      stateAgentName: this.props.agentName,
      workerList: [],
      selectedWorker: null,
      inputText: '',
    };
  }
  async componentDidMount() {
    this.setWorkers();
  }

  handleChange = e => {
    // use instantQuery to get a list of workers
    // SYNC_CLIENT.insightsClient.instantQuery('tr-worker').then(q => {
    //   q.on('searchResult', items => {
    //     Object.entries(items).forEach(([key, value]) => {
    //       console.log('Search result item key:', key);
    //       console.log('Search result item value:', value);
    //     });
    //   });
    //   q.search('');
    // });

    console.log('real event', e);
    const value = e.target.value;
    //Text Field id needs to match State property
    const id = e.target.id;
    let newState = { changed: true };
    newState[id] = value;
    this.setState(newState);
  };

  setWorkers = (query = '') => {
    const { contact_uri: worker_contact_uri } =
      SYNC_CLIENT.workerClient.attributes;

    SYNC_CLIENT.insightsClient.instantQuery('tr-worker').then(q => {
      q.on('searchResult', items => {
        console.log(items);
        this.setState({
          workerList: Object.keys(items).map(workerSid => items[workerSid]),
        });
      });

      q.search(`${query !== '' ? `${query}` : ''}`);
    });
  };

  handleInputChange = event => {
    console.log('handleInputChange', event);
    console.log('handleInputChange', this.state.inputText);
    this.setState({ inputText: event });
    this.handleWorkersListUpdate(event);
    console.log('handleInputChange', this.state.inputText);

    if (event !== '') {
      this.setState({ selectedWorker: null });
    }
  };

  handleChangeQuery = event => {
    console.log('hey');
    const value = event.label;
    console.log(this.state.agentName);
    // //Text Field id needs to match State property
    // const id = event.target.id;
    // let newState = { changed: true };
    // newState[agentName] = value;
    this.setState({ agentName: value });
    this.setState({ selectedWorker: event });
    console.log(this.state.agentName);
  };

  handleOnFocus = () => {
    console.log('handleOnFocus');
    if (this.state.inputText === '' && this.state.workerList.length === 0) {
      this.setWorkers();
    }
  };

  handleWorkersListUpdate = debounce(
    e => {
      if (e) {
        this.setWorkers(`data.attributes.full_name CONTAINS "${e}"`);
      }
    },
    250,
    { maxWait: 1000 }
  );

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
      // testWorkerName: this.state.inputText, // added this to use for the button change
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
    const workers = this.state.workerList
      .map(worker => {
        const { contact_uri, full_name } = worker.attributes;

        return { label: full_name, value: contact_uri };
        // return activity_name !== 'Offline'
        //   ? { label: full_name, value: contact_uri }
        //   : null;
      })
      .filter(elem => elem);

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
                  <FormControl fullWidth>
                    <Select
                      id="agentName"
                      isSearchable={true}
                      name="workers"
                      maxMenuHeight={150}
                      onChange={this.handleChangeQuery}
                      onInputChange={this.handleInputChange}
                      onMenuOpen={this.handleOnFocus}
                      options={workers}
                      inputValue={this.state.inputText}
                      value={this.state.selectedWorker || null}
                    />
                  </FormControl>
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
