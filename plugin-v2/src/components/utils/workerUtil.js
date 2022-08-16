import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();

export const isAgentRole = () => {
  const { roles } = manager.user;
  return roles.indexOf('agent') >= 0;
};
