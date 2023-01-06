import { Notifications } from '@twilio/flex-ui';
import { Button } from '@twilio-paste/core';
import SyncHelper from '../../../../utils/syncUtil/syncUtil';

const SaveButton = ({
  syncEmpty,
  isVisible,
  agentName,
  configuredAgentName,
  agentExtension,
  configuredAgentExt,
  workerSid,
  configuredWorkerSid,
  clickHandler,
  updateHandler,
}) => {
  const saveAgentExtHandler = async () => {
    const mapName = process.env.REACT_APP_SYNC_MAP_NAME;
    const checkAgentName = agentName === '' ? configuredAgentName : agentName;
    const checkAgentExtension =
      agentExtension === '' ? configuredAgentExt : agentExtension;
    const checkWorkerSid = workerSid === '' ? configuredWorkerSid : workerSid;
    const mapKey = checkWorkerSid;

    let mapValue = {
      workerFullName: checkAgentName,
      extensionNumber: checkAgentExtension,
      workerSid: checkWorkerSid,
    };

    // check if there's an existing extension already assigned to an agent
    const existingExtension = await SyncHelper.getMapItem(
      mapName,
      agentExtension
    );

    if (existingExtension.extensionNumber === checkAgentExtension) {
      Notifications.showNotification('extensionAlreadyExists', {
        errorString: existingExtension.workerFullName,
      });
      return;
    }

    // update the sync map item
    await SyncHelper.updateMapItem(mapName, mapKey, mapValue);
    Notifications.showNotification('extensionUpdatedSuccessfully');

    // update syncEmpty state because sync is no longer empty
    syncEmpty();

    clickHandler();
    updateHandler();
  };

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
