import { Button } from '@twilio-paste/core';

const SaveButton = ({ saveAgentExtHandler, syncEmpty }) => {
  return (
    <Button
      onClick={() => {
        saveAgentExtHandler();
        syncEmpty();
      }}
      roundCorners={false}
    >
      Save
    </Button>
  );
};

export default SaveButton;
