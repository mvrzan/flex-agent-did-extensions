import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';

import AgentExtensionView from './components/AgentExtensions/AgentExtensionsView.js';
import registerNotifications from './components/utils/notificationsUtil';

export const PLUGIN_NAME = 'AgentExtensions';

export default class AgentExtensions extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex = typeof Flex, manager = Flex.Manager) {
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    registerNotifications(manager);
    const initializers = [AgentExtensionView];
    initializers.forEach(initializer => initializer(flex, manager));
  }
}
