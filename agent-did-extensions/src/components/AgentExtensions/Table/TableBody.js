import { TBody, Th, Tr, Td } from '@twilio-paste/core';

import RemoveExtIcon from './Icons/RemoveExtIcon';
import EditExtIcon from './Icons/EditExtIcon';

const TableBody = ({
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
            </Th>
          </Tr>
        );
      })}
    </TBody>
  );
};

export default TableBody;
