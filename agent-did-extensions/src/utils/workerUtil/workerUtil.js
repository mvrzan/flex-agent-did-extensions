import { Manager } from '@twilio/flex-ui';

const manager = Manager.getInstance();
const { roles } = manager.user;

export const isAgentRole = () => {
  return roles.indexOf('agent') >= 0;
};
