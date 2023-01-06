import { useEffect, useState } from 'react';
import {
  Button,
  Table,
  THead,
  TBody,
  Th,
  Tr,
  Flex,
  Box,
} from '@twilio-paste/core';
import { Manager, Notifications, SidePanel } from '@twilio/flex-ui';
import {
  Container,
  AttributeTableCell,
  AttributeName,
  AttributeTextField,
} from './NewExtension.styles';
import SyncHelper from '../../../utils/syncUtil/syncUtil';

import FormControl from '@material-ui/core/FormControl';
import Select from 'react-select';
import { debounce } from 'lodash';

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

  const setWorkers = (query = '') => {
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

  const onFocusHandler = () => {
    if (inputText === '' && agents.length === 0) {
      setWorkers();
    }
  };

  let handleWorkersListUpdate = debounce(
    e => {
      if (e) {
        setWorkers(`data.attributes.full_name CONTAINS "${e}"`);
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
    const mapKey = workerSid;

    let mapValue = {
      workerFullName: checkAgentName,
      extensionNumber: checkAgentExtension,
      workerSid: checkWorkerSid,
    };

    console.log(mapValue);
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
    setWorkers();
  }, []);

  return (
    <SidePanel
      displayName="New Agent Extension"
      title={<div>New Agent Extension</div>}
      handleCloseClick={props.clickHandler}
    >
      <Container vertical padding="space30">
        <Table tableLayout="fixed">
          <THead>
            <Tr>
              <AttributeTableCell>Attribute</AttributeTableCell>
              <Th>Value</Th>
            </Tr>
          </THead>
          <TBody>
            <Tr key={`${props.agentName} agentName`}>
              <AttributeTableCell>
                <AttributeName>Agent Name</AttributeName>
              </AttributeTableCell>
              <Th>
                <FormControl fullWidth>
                  <Select
                    id="agentName"
                    isSearchable={true}
                    name="workers"
                    maxMenuHeight={150}
                    onChange={changeQueryHandler}
                    onInputChange={inputChangeHandler}
                    onMenuOpen={onFocusHandler}
                    options={agents}
                    inputValue={inputText === '' ? props.agentName : inputText}
                    value={selectedWorker || null}
                  />
                </FormControl>
              </Th>
            </Tr>
            <Tr key={`${props.agentExt} agentExtension`}>
              <AttributeTableCell>
                <AttributeName>Agent Extension</AttributeName>
              </AttributeTableCell>
              <Th>
                <AttributeTextField
                  id="agentExtension"
                  value={agentExtension}
                  defaultValue={props.agentExt}
                  onChange={changeHandler}
                  onClick={changeHandler}
                  error={agentExtension === '' || isNaN(agentExtension)}
                ></AttributeTextField>
              </Th>
            </Tr>
            <Tr key={`${props.workerSid} workerSid`}>
              <AttributeTableCell>
                <AttributeName>Worker SID</AttributeName>
              </AttributeTableCell>
              <Th>
                <AttributeTextField
                  disabled
                  id="workerSid"
                  value={workerSid == '' ? props.workerSid : workerSid}
                  defaultValue={props.workerSid}
                ></AttributeTextField>
              </Th>
            </Tr>
          </TBody>
        </Table>
        <Flex>
          <Box width="size10" marginLeft="space200" marginTop="space50">
            <Button onClick={props.clickHandler} roundCorners={false}>
              Cancel
            </Button>
          </Box>
          <Box width="size10" marginLeft="space100" marginTop="space50">
            <Button
              onClick={() => {
                saveAgentExtHandler();
                props.syncEmpty();
              }}
              roundCorners={false}
            >
              Save
            </Button>
          </Box>
        </Flex>
      </Container>
    </SidePanel>
  );
};

export default NewExtensionSidePanel;
