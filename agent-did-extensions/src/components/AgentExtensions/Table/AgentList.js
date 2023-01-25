import { TBody, Tr, Td } from '@twilio-paste/core';

import RemoveExtIcon from './Icons/RemoveExtIcon';
import EditExtIcon from './Icons/EditExtIcon';

const AgentList = ({
  agentExtensions,
  updateAgentExtensions,
  sidePanelHandler,
  setAgentInfo,
}) => {
  return (
    <TBody>
      {agentExtensions.map(mapItem => {
        return (
          <Tr key={mapItem.mapKey}>
            <Td>{mapItem.workerFullName}</Td>
            <Td>{mapItem.extensionNumber}</Td>
            <Td> {mapItem.workerSid}</Td>
            <Td>
              <RemoveExtIcon
                mapKey={mapItem.mapKey}
                updateAgentExtensions={updateAgentExtensions}
              />
              <EditExtIcon
                workerFullName={mapItem.workerFullName}
                extensionNumber={mapItem.extensionNumber}
                workerSid={mapItem.workerSid}
                mapKey={mapItem.mapKey}
                sidePanelHandler={sidePanelHandler}
                setAgentInfo={setAgentInfo}
              />
            </Td>
          </Tr>
        );
      })}
    </TBody>
  );
};

export default AgentList;
