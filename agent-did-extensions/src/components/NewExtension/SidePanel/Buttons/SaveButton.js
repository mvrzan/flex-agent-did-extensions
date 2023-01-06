import { Button } from '@twilio-paste/core';

const SaveButton = ({ saveAgentExtHandler, syncEmpty, isVisible }) => {
  return (
    <Button
      onClick={() => {
        saveAgentExtHandler();
        syncEmpty();
      }}
      roundCorners={false}
      disabled={!isVisible}
    >
      Save
    </Button>
  );
};

export default SaveButton;
