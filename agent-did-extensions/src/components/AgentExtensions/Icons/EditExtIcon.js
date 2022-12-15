import { IconButton } from '@twilio/flex-ui';

const EditExtIcon = ({ editExt }) => {
  return (
    <IconButton
      icon={'Settings'}
      style={{ color: 'black' }}
      title={`Edit agent extension`}
      onClick={editExt}
    />
  );
};

export default EditExtIcon;
