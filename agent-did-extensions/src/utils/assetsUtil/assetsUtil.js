import { Manager } from '@twilio/flex-ui';
import ConfigManagerService from '../../utils/serverless/ConfigManager/ConfigManagerService';

let config = {
  data: [],
  version: '',
};

const delay = async ms => {
  return await new Promise(resolve => setTimeout(resolve, ms));
};

export const loadConfig = async () => {
  const listResponse = await ConfigManagerService.list();

  if (listResponse) {
    config = listResponse;
  } else {
    return null;
  }

  return config;
};

export const publishConfig = async publishAgentExtensions => {
  // return values: 0=success, 2=version error, 3=failure,  4=in available activity

  if (
    Manager.getInstance().store.getState().flex.worker.activity.available ===
    true
  ) {
    return 4;
  }

  const newConfig = {
    ...config,
    data: { ...publishAgentExtensions },
  };

  newConfig.data = Object.values(newConfig.data).flat();

  const updateResponse = await ConfigManagerService.update(newConfig);

  if (!updateResponse.success) {
    console.log('Config update failed', updateResponse);

    if (updateResponse.buildSid === 'versionError') {
      return 2;
    }

    return 3;
  }

  // the build will take several seconds. use delay and check in a loop.
  await delay(2000);
  let updateStatus = await ConfigManagerService.updateStatus(
    updateResponse.buildSid
  );

  while (updateStatus.buildStatus !== 'completed') {
    if (
      updateStatus.buildStatus === 'failed' ||
      updateStatus.buildStatus === 'error'
    ) {
      // oh no
      console.log('Config update build failed', updateStatus);
      return 3;
    }

    await delay(2000);
    updateStatus = await ConfigManagerService.updateStatus(
      updateResponse.buildSid
    );
  }

  let publishResponse = await ConfigManagerService.publish(
    updateResponse.buildSid
  );

  if (!publishResponse.success) {
    console.log('Config publish failed', publishResponse);
    return 3;
  }

  return 0;
};
