import { useEffect, useState } from 'react';
import { Flex, Table, Box, Heading, Stack } from '@twilio-paste/core';

import SyncHelper from '../../../utils/syncUtil/syncUtil';
import LoadingScreen from '../LoadingScreen/LoadingScreen';
import NewExtensionSidePanel from '../../NewExtension/SidePanel/NewExtensionSidePanel';
import EmptyView from '../EmptyView/EmptyView';
import ModalView from '../ModalView/ModalView';
import SyncStatus from '../SyncStatus/SyncStatus';
import Alerts from '../Alerts/Alerts';
import TableHeader from '../Table/TableHeader';
import AgentList from '../Table/AgentList';
import NewExtButton from '../../NewExtension/NewExtensionButton/NewExtensionsButton';
import PublishChanges from '../PublishChanges/PublishChanges';
import {
  loadConfig,
  publishConfig,
} from '../../../utils/assetsUtil/assetsUtil';

const AgentExtensionsView = () => {
  const [agentExtensions, setAgentExtensions] = useState([]);
  const [publishAgentExtensions, setPublishAgentExtensions] = useState([]);
  const [assetAgentExtensions, setAssetAgentExtensions] = useState([]);
  const [isVersionMismatch, setIsVersionMismatch] = useState(false);
  const [publishState, setPublishState] = useState(0); // 0: normal; 1: publish in progress; 2: publish version error; 3: publish failed; 4: in available activity
  const [AssetLoadFailed, setAssetLoadFailed] = useState(false);
  const [fetchAsset, setFetchAsset] = useState(true);
  const [isNewExtButtonVisible, setIsNewExtButtonVisible] = useState(true);
  const [isSidePanelVisible, setIsSidePanelVisible] = useState(false);
  const [isLoadingScreenVisible, setIsLoadingScreenVisible] = useState(true);
  const [isPublishButtonVisible, setIsPublishButtonVisible] = useState(false);
  const [noValues, setNoValues] = useState(false);
  const [agentInfo, setAgentInfo] = useState({
    agentName: '',
    agentExt: '',
    workerSid: '',
    mapKey: '',
  });

  const getSyncAgentExtHandler = async () => {
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

    if (publishAgentExtensions.length === 0) {
      setPublishAgentExtensions(formattedSyncMapItems);
    }

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

  const getAssetExtensionsHandler = async () => {
    setFetchAsset(true);

    const config = await loadConfig();

    if (config === null) {
      setAssetLoadFailed(true);
    }

    setAssetLoadFailed(false);
    setIsVersionMismatch(config.versionIsDeployed === false);
    setAssetAgentExtensions(config.data);
    setFetchAsset(false);
  };

  const publishExtensionsHandler = async agentExtensions => {
    setPublishState(1);

    const publishResult = await publishConfig(agentExtensions);
    setPublishState(publishResult);

    if (publishResult === 0) {
      await getAssetExtensionsHandler();
    }
    if (publishResult === 4) {
      return;
    }
    setIsPublishButtonVisible(false);
  };

  useEffect(() => {
    getSyncAgentExtHandler();
    getAssetExtensionsHandler();
  }, []);

  useEffect(() => {
    if (
      JSON.stringify(agentExtensions) === JSON.stringify(publishAgentExtensions)
    ) {
      setIsPublishButtonVisible(false);
    } else {
      setIsPublishButtonVisible(true);
    }
  }, [agentExtensions, publishAgentExtensions]);

  useEffect(() => {
    if (
      JSON.stringify(assetAgentExtensions) === JSON.stringify(agentExtensions)
    ) {
      setIsPublishButtonVisible(false);
    } else {
      setAssetLoadFailed(true);
      setIsPublishButtonVisible(true);
    }
  }, [agentExtensions, assetAgentExtensions]);

  return (
    <Flex>
      <Flex vertical>
        <Box padding="space40">
          <Stack orientation="horizontal" spacing="space50">
            <Heading as="h1" variant="heading10" marginBottom="space40">
              Agent DID Extensions
            </Heading>
            <SyncStatus
              fetchAsset={fetchAsset}
              AssetLoadFailed={AssetLoadFailed}
            />
          </Stack>
          <Stack orientation="horizontal" spacing="space40">
            {isNewExtButtonVisible && (
              <NewExtButton clickHandler={sidePanelHandler} />
            )}
            <PublishChanges
              isPublishButtonVisible={isPublishButtonVisible}
              publishExtensionsHandler={publishExtensionsHandler}
              publishAgentExtensions={agentExtensions}
              fetchAsset={fetchAsset}
            />
            <Alerts
              isPublishButtonVisible={isPublishButtonVisible}
              publishState={publishState}
              isVersionMismatch={isVersionMismatch}
              fetchAsset={fetchAsset}
            />
          </Stack>
        </Box>
        <ModalView isOpen={publishState === 1} />
        <Table striped tableLayout="fixed">
          <TableHeader />
          {isLoadingScreenVisible && <LoadingScreen />}
          {noValues && <EmptyView />}
          <AgentList
            agentExtensions={agentExtensions}
            updateAgentExtensions={getSyncAgentExtHandler}
            sidePanelHandler={sidePanelHandler}
            setAgentInfo={setAgentInfo}
          />
        </Table>
      </Flex>
      {isSidePanelVisible && (
        <NewExtensionSidePanel
          clickHandler={hideSidePanelHandler}
          updateHandler={getSyncAgentExtHandler}
          configuredAgentName={agentInfo.agentName}
          configuredAgentExt={agentInfo.agentExt}
          configuredWorkerSid={agentInfo.workerSid}
          syncEmpty={noValuesHandler}
        />
      )}
    </Flex>
  );
};

export default AgentExtensionsView;
