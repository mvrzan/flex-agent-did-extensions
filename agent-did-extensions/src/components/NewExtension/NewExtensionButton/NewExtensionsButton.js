import { Button } from '@twilio-paste/core';

const NewExtButton = ({ clickHandler }) => {
  return (
    <Button variant="outlined" onClick={clickHandler}>
      Add New Extension
    </Button>
  );
};

export default NewExtButton;
