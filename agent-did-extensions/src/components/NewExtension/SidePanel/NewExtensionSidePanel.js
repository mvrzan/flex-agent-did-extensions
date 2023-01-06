import { useEffect, useState } from 'react';
import {
  Stack,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Input,
  Tooltip,
  Separator,
  Box,
} from '@twilio-paste/core';
import { Manager, Notifications, SidePanel } from '@twilio/flex-ui';

import SyncHelper from '../../../utils/syncUtil/syncUtil';
import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import { debounce } from 'lodash';
import CancelButton from './Buttons/CancelButton';
import SaveButton from './Buttons/SaveButton';

const SYNC_CLIENT = Manager.getInstance();

const NewExtensionSidePanel = ({
  clickHandler,
  updateHandler,
  syncEmpty,
  configuredAgentExt,
  configuredAgentName,
  configuredWorkerSid,
}) => {
  const [agentExtension, setAgentExtension] = useState();
  const [agents, setAgents] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [agentName, setAgentName] = useState('');
  const [workerSid, setWorkerSid] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  const changeHandler = event => {
    setAgentExtension(event.target.value);
  };

  const getAgents = (query = '') => {
    SYNC_CLIENT.insightsClient.instantQuery('tr-worker').then(q => {
      q.on('searchResult', items => {
        const responseWorkers = Object.keys(items).map(
          workerSid => items[workerSid]
        );

        setAgents(
          responseWorkers
            .map(worker => {
              const { contact_uri, full_name } = worker.attributes;
              const workersid = worker.worker_sid;

              return {
                label: full_name,
                value: contact_uri,
                workersid: workersid,
              };
            })
            .filter(elem => elem)
        );
      });

      q.search(`${query !== '' ? `${query}` : ''}`);
    });
  };

  const inputChangeHandler = event => {
    setInputText(event);
    workersListUpdateHandler(event);

    if (event !== '') {
      setSelectedWorker(null);
    }
  };

  const changeQueryHandler = event => {
    setSelectedWorker(event);
    setAgentName(event.label);
    setWorkerSid(event.workersid);
  };

  let workersListUpdateHandler = debounce(
    e => {
      if (e) {
        getAgents(`data.attributes.full_name CONTAINS "${e}"`);
      }
    },
    250,
    { maxWait: 1000 }
  );

  const saveAgentExtHandler = async () => {
    const mapName = process.env.REACT_APP_SYNC_MAP_NAME;
    const checkAgentName = agentName === '' ? configuredAgentName : agentName;
    const checkAgentExtension =
      agentExtension === '' ? configuredAgentExt : agentExtension;
    const checkWorkerSid = workerSid === '' ? configuredWorkerSid : workerSid;
    const mapKey = checkWorkerSid;

    let mapValue = {
      workerFullName: checkAgentName,
      extensionNumber: checkAgentExtension,
      workerSid: checkWorkerSid,
    };

    // check if there's an existing extension already assigned to an agent
    const existingExtension = await SyncHelper.getMapItem(
      mapName,
      agentExtension
    );

    if (existingExtension.extensionNumber === checkAgentExtension) {
      Notifications.showNotification('extensionAlreadyExists', {
        errorString: existingExtension.workerFullName,
      });
      return;
    }

    // update the sync map item
    await SyncHelper.updateMapItem(mapName, mapKey, mapValue);
    Notifications.showNotification('extensionUpdatedSuccessfully');

    // update syncEmpty state because sync is no longer empty
    syncEmpty();

    clickHandler();
    updateHandler();
  };

  useEffect(() => {
    if (agentExtension && selectedWorker) {
      setIsVisible(true);
    }
    if (!agentExtension || !selectedWorker) {
      setIsVisible(false);
    }
    if (isNaN(agentExtension)) {
      setIsVisible(false);
    }
    if (configuredAgentExt) {
      setIsVisible(true);
    }
  }, [agentExtension, selectedWorker, configuredAgentExt]);

  useEffect(() => {
    setAgentExtension(configuredAgentExt);
  }, [configuredAgentExt]);

  useEffect(() => {
    setWorkerSid(configuredWorkerSid);
  }, [configuredWorkerSid]);

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <SidePanel
      displayName="New Agent Extension"
      title={<div>New Agent Extension</div>}
      handleCloseClick={clickHandler}
    >
      <Stack orientation="vertical" spacing="space10">
        <Table variant="borderless">
          <THead>
            <Tr>
              <Th>Attribute</Th>
              <Th>Value</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr key={`${configuredAgentName} agentName`}>
              <Tooltip text="Search for the name of the Agent that is going to use the phone number extension.">
                <Th width="size10">Agent Name</Th>
              </Tooltip>
              <Th>
                <FormControl fullWidth>
                  <Select
                    id="agentName"
                    isSearchable
                    name="workers"
                    maxMenuHeight={150}
                    onChange={changeQueryHandler}
                    onInputChange={inputChangeHandler}
                    options={agents}
                    inputValue={
                      inputText === '' ? configuredAgentName : inputText
                    }
                    value={selectedWorker || null}
                  />
                </FormControl>
              </Th>
            </Tr>
            <Tr key={`${configuredAgentExt} agentExtension`}>
              <Tooltip text="Enter a numerical agent extension of your choice.">
                <Th>Agent Extension</Th>
              </Tooltip>
              <Th>
                <Input
                  id="agentExtension"
                  type="number"
                  placeholder="Enter a 4-digit number"
                  value={agentExtension}
                  defaultValue={configuredAgentExt}
                  onChange={changeHandler}
                  onClick={changeHandler}
                  hasError={isNaN(agentExtension)}
                />
              </Th>
            </Tr>
            <Tr key={`${configuredWorkerSid} workerSid`}>
              <Tooltip text="The agents identifier (worker SID) is going to be automatically populated.">
                <Th>Worker SID</Th>
              </Tooltip>
              <Th>
                <Input
                  disabled
                  id="workerSid"
                  placeholder="Auto-populated"
                  value={workerSid == '' ? configuredWorkerSid : workerSid}
                  defaultValue={configuredWorkerSid}
                />
              </Th>
            </Tr>
          </TBody>
        </Table>
        <Box padding="space40">
          <Stack orientation="horizontal" spacing="space30">
            <CancelButton clickHandler={clickHandler} />
            <SaveButton
              saveAgentExtHandler={saveAgentExtHandler}
              syncEmpty={syncEmpty}
              isVisible={isVisible}
            />
          </Stack>
        </Box>
      </Stack>
      <Separator orientation="horizontal" />
    </SidePanel>
  );
};

export default NewExtensionSidePanel;
