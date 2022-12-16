import React, { useEffect, useState } from 'react';
import { Notifications } from '@twilio/flex-ui';
import { Flex, Table, THead, TBody, Th, Tr, Td } from '@twilio-paste/core';

import SyncHelper from '../../utils/syncUtil';
import NewExtButton from '../NewExtension/NewExtensionButton/NewExtensionsButton';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import NewExtensionSidePanel from '../NewExtension/NewExtensionSidePanel';
import EmptyView from './EmptyView/SyncEmptyView';

import EditExtIcon from './Icons/EditExtIcon';
import RemoveExtIcon from './Icons/RemoveExtIcon';

// class AgentExtensionsLogic extends React.Component {
//   constructor() {
//     super();
//     this.state = {
//       mapItems: [],
//       show: false,
//       showNewExtButton: true,
//       showLoadingScreen: true,
//       syncEmpty: false,
//       agentName: '',
//       agentExt: '',
//       workerSid: '',
//       mapKey: '',
//     };
//   }

//   showModal = () => {
//     this.setState({ show: true, showNewExtButton: false });
//   };

//   hideModal = () => {
//     this.setState({
//       show: false,
//       showNewExtButton: true,
//       agentName: '',
//       agentExt: '',
//       workerSid: '',
//       mapKey: '',
//     });
//   };

//   mapItemStateUpdate = async () => {
//     const getSyncMapItems = await SyncHelper.getMapItems(
//       process.env.REACT_APP_SYNC_MAP_NAME
//     );

//     if (getSyncMapItems.length === 0) {
//       console.warn('Sync Map is empty.');

//       this.setState({ syncEmpty: true, showLoadingScreen: false });
//       return;
//     }

//     // prep syncMap data
//     const formattedSyncMapItems = getSyncMapItems.map(mapItem => {
//       // items return from the sync map have a slightly different structure in Flex 2.x: item.value vs item.descriptor.data
//       let newObject = mapItem.item.descriptor.data;
//       newObject.mapKey = mapItem.item.descriptor.key;
//       return newObject;
//     });

//     this.setState({
//       mapItems: formattedSyncMapItems,
//       showLoadingScreen: false,
//     });
//   };

//   deleteSyncMapItem = async mapKey => {
//     const mapName = process.env.REACT_APP_SYNC_MAP_NAME;
//     await SyncHelper.deleteMapItem(mapName, mapKey);
//     Notifications.showNotification('extDeleted');

//     const getSyncMapItems = await SyncHelper.getMapItems(
//       process.env.REACT_APP_SYNC_MAP_NAME
//     );

//     if (getSyncMapItems.length === 0) {
//       console.warn('Sync Map is empty.');

//       this.setState({ syncEmpty: true, mapItems: [] });
//     }

//     this.componentDidMount();
//   };

//   updateMapItem = (agentName, agentExt, workerSid, mapKey) => {
//     this.setState({ agentName, agentExt, workerSid, mapKey });
//     this.showModal();
//   };

//   setSyncState = () =>
//     this.state.syncEmpty && this.setState({ syncEmpty: false });

//   componentDidMount = () => this.mapItemStateUpdate();

//   render() {
//     return (
//       <Flex>
//         <Flex vertical>
//           <Table striped tableLayout="fixed">
//             <THead>
//               <Tr>
//                 <Th>Agent Name</Th>
//                 <Th>Agent Extension</Th>
//                 <Th>Worker SID</Th>
//                 <Th textAlign="right">
//                   {this.state.showNewExtButton && (
//                     <NewExtButton clickHandler={this.showModal}></NewExtButton>
//                   )}
//                 </Th>
//               </Tr>
//             </THead>
//             {this.state.showLoadingScreen && <LoadingScreen />}
//             {this.state.syncEmpty && <EmptyView />}
//             <TBody>
//               {this.state.mapItems.map(mapItem => {
//                 return (
//                   <Tr key={mapItem.mapKey}>
//                     <Th>
//                       <Td>{mapItem.workerFullName}</Td>
//                     </Th>
//                     <Th>
//                       <Td>{mapItem.extensionNumber}</Td>
//                     </Th>
//                     <Th>
//                       <Td>{mapItem.workerSid}</Td>
//                     </Th>
//                     <Th>
//                       <RemoveExtIcon
//                         removeExt={this.deleteSyncMapItem.bind(
//                           this,
//                           mapItem.mapKey
//                         )}
//                       />
//                       <EditExtIcon
//                         editExt={this.updateMapItem.bind(
//                           this,
//                           mapItem.workerFullName,
//                           mapItem.extensionNumber,
//                           mapItem.workerSid,
//                           mapItem.mapKey
//                         )}
//                       />
//                     </Th>
//                   </Tr>
//                 );
//               })}
//             </TBody>
//           </Table>
//         </Flex>
//         {this.state.show && (
//           <NewExtensionSidePanel
//             clickHandler={this.hideModal}
//             updateHandler={this.mapItemStateUpdate}
//             agentName={this.state.agentName}
//             // inputText={this.agentName}
//             agentExt={this.state.agentExt}
//             workerSid={this.state.workerSid}
//             mapKey={this.state.mapKey}
//             mapItems={this.state.mapItems}
//             syncEmpty={this.setSyncState}
//           />
//         )}
//       </Flex>
//     );
//   }
// }

const AgentExtensionsLogic = () => {
  const [agentExtensions, setAgentExtensions] = useState([]);
  const [isNewExtButtonVisible, setIsNewExtButtonVisible] = useState(true);
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(true);
  const [noValues, setNoValues] = useState(false);
  const [agentInfo, setAgentInfo] = useState({
    agentName: '',
    agentExt: '',
    workerSid: '',
    mapKey: '',
  });

  const sidePanelHandler = () => {
    setIsSidePanelVisible(true);
    setIsNewExtButtonVisible(false);
  };

  const hideSidePanelHandler = () => {
    setIsNewExtButtonVisible(true);
    setIsSidePanelVisible(false);
    setAgentInfo(prevState => ({
      ...prevState,
      agentName: '',
      agentExt: '',
      workerSid: '',
      mapKey: '',
    }));
  };

  const getAgentExtHandler = async () => {
    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      console.warn('Sync Map is empty.');
      setIsLoadingScreenVisible(false);
      setNoValues(true);
      return;
    }

    // prep syncMap data
    const formattedSyncMapItems = getSyncMapItems.map(mapItem => {
      // items return from the sync map have a slightly different structure in Flex 2.x: item.value vs item.descriptor.data
      let newObject = mapItem.item.descriptor.data;
      newObject.mapKey = mapItem.item.descriptor.key;
      return newObject;
    });
    console.log(formattedSyncMapItems);
    setAgentExtensions(formattedSyncMapItems);
    console.log('agentExt', agentExtensions);
    setIsLoadingScreenVisible(false);
    console.log(isLoadingScreenVisible);
  };

  const editAgentExtHandler = (agentName, agentExt, workerSid, mapKey) => {
    setAgentInfo(prevState => ({
      ...prevState,
      agentName,
      agentExt,
      workerSid,
      mapKey,
    }));
    sidePanelHandler();
  };

  const deleteAgentExtHandler = async mapKey => {
    const mapName = process.env.REACT_APP_SYNC_MAP_NAME;

    await SyncHelper.deleteMapItem(mapName, mapKey);
    Notifications.showNotification('extDeleted');

    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      console.warn('Sync Map is empty.');
      setAgentExtensions([]);
      setNoValues(true);
    }
  };

  const noValuesHandler = () => {
    noValues && setNoValues(false);
  };

  // useEffect(() => {
  //   if (agentExtensions.length !== 0) {
  //     console.log('agentExt', agentExtensions);
  //   }
  // }, [agentExtensions]);

  useEffect(() => {
    getAgentExtHandler();
  }, [agentExtensions]);

  return (
    <Flex>
      <Flex vertical>
        <Table striped tableLayout="fixed">
          <THead>
            <Tr>
              <Th>Agent Name</Th>
              <Th>Agent Extension</Th>
              <Th>Worker SID</Th>
              <Th textAlign="right">
                {isNewExtButtonVisible && (
                  <NewExtButton clickHandler={sidePanelHandler}></NewExtButton>
                )}
              </Th>
            </Tr>
          </THead>
          {isLoadingScreenVisible && <LoadingScreen />}
          {noValues && <EmptyView />}
          <TBody>
            {agentExtensions.map(mapItem => {
              console.log(mapItem);
              return (
                <Tr key={mapItem.mapKey}>
                  <Th>
                    <Td>{mapItem.workerFullName}</Td>
                  </Th>
                  <Th>
                    <Td>{mapItem.extensionNumber}</Td>
                  </Th>
                  <Th>
                    <Td>{mapItem.workerSid}</Td>
                  </Th>
                  <Th>
                    <RemoveExtIcon
                      removeExt={() => deleteAgentExtHandler(mapItem.mapKey)}
                    />
                    <EditExtIcon
                      editExt={() =>
                        editAgentExtHandler(
                          mapItem.workerFullName,
                          mapItem.extensionNumber,
                          mapItem.workerSid,
                          mapItem.mapKey
                        )
                      }
                    />
                  </Th>
                </Tr>
              );
            })}
          </TBody>
        </Table>
      </Flex>
      {isSidePanelVisible && (
        <NewExtensionSidePanel
          clickHandler={hideSidePanelHandler}
          updateHandler={getAgentExtHandler}
          agentName={agentInfo.agentName}
          agentExt={agentInfo.agentExt}
          workerSid={agentInfo.workerSid}
          mapKey={agentInfo.mapKey}
          mapItems={agentExtensions}
          syncEmpty={noValuesHandler}
        />
      )}
    </Flex>
  );
};

export default AgentExtensionsLogic;
