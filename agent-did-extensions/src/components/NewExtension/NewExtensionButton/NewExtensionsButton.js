import { Button } from '@twilio-paste/core';
import { PlusIcon } from '@twilio-paste/icons/esm/PlusIcon';

const NewExtButton = ({ clickHandler }) => {
  return (
    <Button variant="outlined" onClick={clickHandler}>
      <PlusIcon decorative />
      Add New Extension
    </Button>
  );
};

export default NewExtButton;
