import { useEffect, useState } from 'react';
import {
  Stack,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Flex,
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

const NewExtensionSidePanel = props => {
  const [agentExtension, setAgentExtension] = useState();
  const [agents, setAgents] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [agentName, setAgentName] = useState('');
  const [workerSid, setWorkerSid] = useState('');

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
    handleWorkersListUpdate(event);

    if (event !== '') {
      setSelectedWorker(null);
    }
  };

  const changeQueryHandler = event => {
    setSelectedWorker(event);
    setAgentName(event.label);
    setWorkerSid(event.workersid);
  };

  let handleWorkersListUpdate = debounce(
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
    const checkAgentName = agentName === '' ? props.agentName : agentName;
    const checkAgentExtension =
      agentExtension === '' ? props.agentExt : agentExtension;
    const checkWorkerSid = workerSid === '' ? props.workerSid : workerSid;
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
    props.syncEmpty();

    props.clickHandler();
    props.updateHandler();
  };

  useEffect(() => {
    getAgents();
  }, []);

  return (
    <SidePanel
      displayName="New Agent Extension"
      title={<div>New Agent Extension</div>}
      handleCloseClick={props.clickHandler}
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
            <Tr key={`${props.agentName} agentName`}>
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
                    inputValue={inputText === '' ? props.agentName : inputText}
                    value={selectedWorker || null}
                  />
                </FormControl>
              </Th>
            </Tr>
            <Tr key={`${props.agentExt} agentExtension`}>
              <Tooltip text="Enter a numerical agent extension of your choice.">
                <Th>Agent Extension</Th>
              </Tooltip>
              <Th>
                <Input
                  id="agentExtension"
                  value={agentExtension}
                  defaultValue={props.agentExt}
                  onChange={changeHandler}
                  onClick={changeHandler}
                  // hasError={agentExtension === '' || isNaN(agentExtension)}
                />
              </Th>
            </Tr>
            <Tr key={`${props.workerSid} workerSid`}>
              <Tooltip text="The agents identifier (worker SID) is going to be automatically populated.">
                <Th>Worker SID</Th>
              </Tooltip>
              <Th>
                <Input
                  disabled
                  id="workerSid"
                  value={workerSid == '' ? props.workerSid : workerSid}
                  defaultValue={props.workerSid}
                />
              </Th>
            </Tr>
          </TBody>
        </Table>
        <Box padding="space40">
          <Stack orientation="horizontal" spacing="space30">
            <CancelButton clickHandler={props.clickHandler} />
            <SaveButton
              saveAgentExtHandler={saveAgentExtHandler}
              syncEmpty={props.syncEmpty}
            />
          </Stack>
        </Box>
      </Stack>
      <Separator orientation="horizontal" />
    </SidePanel>
  );
};

export default NewExtensionSidePanel;
