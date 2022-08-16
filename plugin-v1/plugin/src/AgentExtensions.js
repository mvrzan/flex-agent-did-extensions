import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';

import AgentExtensionView from './components/AgentExtensions/AgentExtensionsView';
import registerNotifications from './components/utils/notificationsUtil';

export const PLUGIN_NAME = 'AgentExtensions';

export default class AgentExtensions extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex = typeof Flex, manager = Flex.Manager) {
    registerNotifications(manager);
    const initializers = [AgentExtensionView];
    initializers.forEach(initializer => initializer(flex, manager));
  }
}
