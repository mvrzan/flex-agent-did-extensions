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
    // pass the PasteThemeProvider to all Flex UI components without the need to wrap them separately
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    // register custom notifications with Flex manager
    registerNotifications(manager);
    const initializers = [AgentExtensionView];
    initializers.forEach(initializer => initializer(flex, manager));
  }
}
