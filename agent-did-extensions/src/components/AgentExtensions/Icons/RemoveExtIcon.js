import { IconButton } from '@twilio/flex-ui';

const RemoveExtIcon = ({ removeExt }) => {
  return (
    <IconButton
      icon={'Close'}
      style={{ color: 'red' }}
      title={`Delete agent extension`}
      onClick={removeExt}
    />
  );
};

export default RemoveExtIcon;
