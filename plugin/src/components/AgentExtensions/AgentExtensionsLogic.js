import React, { Component } from 'react';
import { IconButton, FlexBox, Notifications } from '@twilio/flex-ui';
import {
  TableHead,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@material-ui/core';

import { TableData, TableHeaderCell } from './AgentExtensions.style';
import SyncHelper from '../utils/syncUtil';
import NewExtButton from '../NewExtension/NewExtensionsButton';
import LoadingScreen from './LoadingScreen';
import NewExtensionSidePanel from '../NewExtension/NewExtensionSidePanel';
import SyncEmpty from './SyncEmptyView';

class AgentExtensionsLogic extends Component {
  constructor() {
    super();
    this.state = {
      mapItems: [],
      show: false,
      showNewExtButton: true,
      showLoadingScreen: true,
      syncEmpty: false,
      agentName: '',
      agentExt: '',
      workerSid: '',
      mapKey: '',
    };
  }

  showModal = () => {
    this.setState({ show: true });
    this.setState({ showNewExtButton: false });
  };

  hideModal = () => {
    this.setState({ show: false });
    this.setState({ showNewExtButton: true });
    this.setState({ agentName: '' });
    this.setState({ agentExt: '' });
    this.setState({ workerSid: '' });
    this.setState({ mapKey: '' });
  };

  mapItemStateUpdate = async () => {
    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      console.warn('Sync Map is empty.');

      this.setState({ syncEmpty: true });
      this.setState({ showLoadingScreen: false });
      return;
    }

    // prep syncMap data
    const formattedSyncMapItems = getSyncMapItems.map(mapItem => {
      let newObject = mapItem.item.value;
      newObject.mapKey = mapItem.item.key;
      return newObject;
    });

    this.setState({ mapItems: formattedSyncMapItems });
    this.setState({ showLoadingScreen: false });
  };

  deleteSyncMapItem = async mapKey => {
    const mapName = process.env.REACT_APP_SYNC_MAP_NAME;
    await SyncHelper.deleteMapItem(mapName, mapKey);
    Notifications.showNotification('extDeleted');

    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      console.warn('Sync Map is empty.');

      this.setState({ syncEmpty: true });
      this.setState({ mapItems: [] });
    }

    this.componentDidMount();
  };

  updateMapItem = (agentName, agentExt, workerSid, mapKey) => {
    this.setState({ agentName: agentName });
    this.setState({ agentExt: agentExt });
    this.setState({ workerSid: workerSid });
    this.setState({ mapKey: mapKey });
    this.showModal();
  };

  setSyncState = () =>
    this.state.syncEmpty && this.setState({ syncEmpty: false });

  componentDidMount = () => this.mapItemStateUpdate();

  render() {
    return (
      <div>
        <FlexBox>
          <FlexBox vertical>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell style={{ width: 100 }}>
                    Agent Name
                  </TableHeaderCell>
                  <TableHeaderCell style={{ width: 100 }}>
                    Agent Extension
                  </TableHeaderCell>
                  <TableHeaderCell style={{ width: 150 }}>
                    Worker SID
                  </TableHeaderCell>
                  <TableHeaderCell style={{ width: 10 }}>
                    {this.state.showNewExtButton && (
                      <NewExtButton
                        clickHandler={this.showModal}
                      ></NewExtButton>
                    )}
                  </TableHeaderCell>
                </TableRow>
              </TableHead>
              {this.state.showLoadingScreen && <LoadingScreen />}
              {this.state.syncEmpty && <SyncEmpty />}
              <TableBody>
                {this.state.mapItems.map(mapItem => {
                  return (
                    <TableRow key={mapItem.mapKey}>
                      <TableCell>
                        <TableData>{mapItem.workerFullName}</TableData>
                      </TableCell>
                      <TableCell>
                        <TableData>{mapItem.extensionNumber}</TableData>
                      </TableCell>
                      <TableCell>
                        <TableData>{mapItem.workerSid}</TableData>
                      </TableCell>
                      <TableCell>
                        <IconButton
                          icon={'Close'}
                          style={{ color: 'red' }}
                          title={`Delete agent extension`}
                          onClick={this.deleteSyncMapItem.bind(
                            this,
                            mapItem.mapKey
                          )}
                        />
                        <IconButton
                          icon={'Settings'}
                          style={{ color: 'black' }}
                          title={`Update agent extension`}
                          onClick={this.updateMapItem.bind(
                            this,
                            mapItem.workerFullName,
                            mapItem.extensionNumber,
                            mapItem.workerSid,
                            mapItem.mapKey
                          )}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </FlexBox>
          {this.state.show && (
            <NewExtensionSidePanel
              clickHandler={this.hideModal}
              updateHandler={this.mapItemStateUpdate}
              agentName={this.state.agentName}
              agentExt={this.state.agentExt}
              workerSid={this.state.workerSid}
              mapKey={this.state.mapKey}
              mapItems={this.state.mapItems}
              syncEmpty={this.setSyncState}
            />
          )}
        </FlexBox>
      </div>
    );
  }
}

export default AgentExtensionsLogic;
