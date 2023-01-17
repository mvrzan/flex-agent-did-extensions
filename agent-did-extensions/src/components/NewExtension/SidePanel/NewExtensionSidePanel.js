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
import { Manager, SidePanel } from '@twilio/flex-ui';

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

  const getAgents = async (query = '') => {
    try {
      const instantQuery = await SYNC_CLIENT.insightsClient.instantQuery(
        'tr-worker'
      );
      const promise = new Promise(resolve => {
        instantQuery.on('searchResult', items => {
          const responseWorkers = Object.keys(items).map(
            workerSid => items[workerSid]
          );
          resolve(responseWorkers);
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
      });

      void instantQuery.search(`${query !== '' ? `${query}` : ''}`);

      return promise;
    } catch (error) {
      console.log('ERROR', error);
    }
  };

  const inputChangeHandler = event => {
    setInputText(event);
    workersListUpdateHandler(event);

    if (event !== '') {
      setSelectedWorker(null);
      return;
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
    setWorkerSid(configuredWorkerSid);
  }, [configuredAgentExt, configuredWorkerSid]);

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
                  value={workerSid === '' ? configuredWorkerSid : workerSid}
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
              syncEmpty={syncEmpty}
              isVisible={isVisible}
              agentName={agentName}
              configuredAgentName={configuredAgentName}
              agentExtension={agentExtension}
              configuredAgentExt={configuredAgentExt}
              workerSid={workerSid}
              configuredWorkerSid={configuredWorkerSid}
              clickHandler={clickHandler}
              updateHandler={updateHandler}
            />
          </Stack>
        </Box>
      </Stack>
      <Separator orientation="horizontal" />
    </SidePanel>
  );
};

export default NewExtensionSidePanel;
