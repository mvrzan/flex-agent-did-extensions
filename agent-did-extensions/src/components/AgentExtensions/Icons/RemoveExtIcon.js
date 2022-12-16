import { IconButton } from '@twilio/flex-ui';
import { Notifications } from '@twilio/flex-ui';

import SyncHelper from '../../../utils/syncUtil';

const RemoveExtIcon = ({ mapKey, updateAgentExtensions }) => {
  const deleteAgentExtHandler = async mapKey => {
    const mapName = process.env.REACT_APP_SYNC_MAP_NAME;

    await SyncHelper.deleteMapItem(mapName, mapKey);
    Notifications.showNotification('extDeleted');

    const getSyncMapItems = await SyncHelper.getMapItems(
      process.env.REACT_APP_SYNC_MAP_NAME
    );

    if (getSyncMapItems.length === 0) {
      updateAgentExtensions([]);
      return;
    }

    updateAgentExtensions();
  };

  return (
    <IconButton
      icon={'Close'}
      style={{ color: 'red' }}
      title={`Delete agent extension`}
      onClick={() => deleteAgentExtHandler(mapKey)}
    />
  );
};

export default RemoveExtIcon;
