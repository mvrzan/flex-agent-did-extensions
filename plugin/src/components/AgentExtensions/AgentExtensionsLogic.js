import React from 'react';
import {
  IconButton,
  Icon,
  Notifications,
  MessagingCanvas,
  SidePanel,
} from '@twilio/flex-ui';
import {
  Flex,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Td,
  Text,
  Box,
} from '@twilio-paste/core';
import { Theme } from '@twilio-paste/core/theme';
import { EditIcon } from '@twilio-paste/icons/esm/EditIcon';
// import { SidePanel } from '@twilio/flex-ui-core';

import { TableData, TableHeaderCell } from './AgentExtensions.style';
import SyncHelper from '../utils/syncUtil';
import NewExtButton from '../NewExtension/NewExtensionsButton';
import LoadingScreen from './LoadingScreen';
import NewExtensionSidePanel from '../NewExtension/NewExtensionSidePanel';
import SyncEmpty from './SyncEmptyView';
// import { Box } from '@material-ui/core';

class AgentExtensionsLogic extends React.Component {
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
    this.setState({ show: true, showNewExtButton: false });
  };

  hideModal = () => {
    this.setState({
      show: false,
      showNewExtButton: true,
      agentName: '',
      agentExt: '',
      workerSid: '',
      mapKey: '',
    });
  };

  mapItemStateUpdate = async () => {
    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      console.warn('Sync Map is empty.');

      this.setState({ syncEmpty: true, showLoadingScreen: false });
      return;
    }

    // prep syncMap data
    const formattedSyncMapItems = getSyncMapItems.map(mapItem => {
      // items return from the sync map have a slightly different structure: item.value vs item.descriptor.data
      let newObject = mapItem.item.descriptor.data;
      newObject.mapKey = mapItem.item.descriptor.key;
      return newObject;
    });

    this.setState({
      mapItems: formattedSyncMapItems,
      showLoadingScreen: false,
    });
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

      this.setState({ syncEmpty: true, mapItems: [] });
    }

    this.componentDidMount();
  };

  updateMapItem = (agentName, agentExt, workerSid, mapKey) => {
    this.setState({ agentName, agentExt, workerSid, mapKey });
    this.showModal();
  };

  setSyncState = () =>
    this.state.syncEmpty && this.setState({ syncEmpty: false });

  componentDidMount = () => this.mapItemStateUpdate();

  render() {
    return (
      <Flex>
        <Flex vertical>
          <Table striped tableLayout="fixed">
            <THead>
              <Tr>
                <TableHeaderCell>Agent Name</TableHeaderCell>
                <TableHeaderCell>Agent Extension</TableHeaderCell>
                <TableHeaderCell>Worker SID</TableHeaderCell>
                <TableHeaderCell textAlign="right">
                  {this.state.showNewExtButton && (
                    <NewExtButton clickHandler={this.showModal}></NewExtButton>
                  )}
                </TableHeaderCell>
              </Tr>
            </THead>
            {this.state.showLoadingScreen && <LoadingScreen />}
            {this.state.syncEmpty && <SyncEmpty />}
            <TBody>
              {this.state.mapItems.map(mapItem => {
                return (
                  <Tr key={mapItem.mapKey}>
                    <Th>
                      <TableData>{mapItem.workerFullName}</TableData>
                    </Th>
                    <Th>
                      <TableData>{mapItem.extensionNumber}</TableData>
                    </Th>
                    <Th>
                      <TableData>{mapItem.workerSid}</TableData>
                    </Th>
                    <Th>
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
                    </Th>
                  </Tr>
                );
              })}
            </TBody>
          </Table>
        </Flex>
        {this.state.show && (
          <NewExtensionSidePanel
            clickHandler={this.hideModal}
            updateHandler={this.mapItemStateUpdate}
            agentName={this.state.agentName}
            // inputText={this.agentName}
            agentExt={this.state.agentExt}
            workerSid={this.state.workerSid}
            mapKey={this.state.mapKey}
            mapItems={this.state.mapItems}
            syncEmpty={this.setSyncState}
          />
        )}
      </Flex>
    );
  }
}

export default AgentExtensionsLogic;
