import { useEffect, useState } from 'react';
import { Flex, Table } from '@twilio-paste/core';

import SyncHelper from '../../utils/syncUtil';
import LoadingScreen from './LoadingScreen/LoadingScreen';
import NewExtensionSidePanel from '../NewExtension/NewExtensionSidePanel';
import EmptyView from './EmptyView/SyncEmptyView';

import TableHeader from './Table/TableHeader';
import TableBody from './Table/TableBody';

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

  const getAgentExtHandler = async () => {
    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      setIsLoadingScreenVisible(false);
      setNoValues(true);
      setAgentExtensions([]);
      return;
    }

    // prep syncMap data
    const formattedSyncMapItems = getSyncMapItems.map(mapItem => {
      let newObject = mapItem.item.descriptor.data;
      newObject.mapKey = mapItem.item.descriptor.key;
      return newObject;
    });

    setAgentExtensions(formattedSyncMapItems);
    setIsLoadingScreenVisible(false);
  };

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

  const noValuesHandler = () => {
    noValues && setNoValues(false);
  };

  useEffect(() => {
    getAgentExtHandler();
  }, []);

  return (
    <Flex>
      <Flex vertical>
        <Table striped tableLayout="fixed">
          <TableHeader
            isNewExtButtonVisible={isNewExtButtonVisible}
            clickHandler={sidePanelHandler}
          />
          {isLoadingScreenVisible && <LoadingScreen />}
          {noValues && <EmptyView />}
          <TableBody
            agentExtensions={agentExtensions}
            updateAgentExtensions={getAgentExtHandler}
            sidePanelHandler={sidePanelHandler}
            setAgentInfo={setAgentInfo}
          />
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
