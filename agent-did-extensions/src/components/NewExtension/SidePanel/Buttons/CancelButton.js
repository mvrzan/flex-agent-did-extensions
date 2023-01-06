import { Button } from '@twilio-paste/core';

const CancelButton = ({ clickHandler }) => {
  return (
    <Button onClick={clickHandler} roundCorners={false}>
      Cancel
    </Button>
  );
};
export default CancelButton;
