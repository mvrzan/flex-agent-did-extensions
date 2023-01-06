import { IconButton } from '@twilio/flex-ui';

const EditExtIcon = ({
  workerFullName,
  extensionNumber,
  workerSid,
  mapKey,
  sidePanelHandler,
  setAgentInfo,
}) => {
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

  return (
    <IconButton
      icon={'Settings'}
      style={{ color: 'black' }}
      title={`Edit agent extension`}
      onClick={() =>
        editAgentExtHandler(workerFullName, extensionNumber, workerSid, mapKey)
      }
    />
  );
};

export default EditExtIcon;
