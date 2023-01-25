import { Button } from '@twilio-paste/core';

const CancelButton = ({ clickHandler, updateHandler }) => {
  return (
    <Button
      onClick={() => {
        clickHandler();
        updateHandler();
      }}
      roundCorners={false}
    >
      Cancel
    </Button>
  );
};
export default CancelButton;
