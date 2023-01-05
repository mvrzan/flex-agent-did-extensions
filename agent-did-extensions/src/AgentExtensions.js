import { FlexPlugin } from '@twilio/flex-plugin';
import { CustomizationProvider } from '@twilio-paste/core/customization';
import { View } from '@twilio/flex-ui';

import SideNavigationIcon from './components/SideNavigation/SideNavigationIcon.js';
import registerNotifications from './utils/notifications/notificationsUtil.js';
import AgentExtensionsLogic from './components/AgentExtensions/AgentExtensionsLogic.js';
import { isAgentRole } from './utils/workerUtil/workerUtil';

export const PLUGIN_NAME = 'AgentExtensions';

export default class AgentExtensions extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(flex, manager) {
    // pass the PasteThemeProvider to all Flex UI components without the need to wrap them separately
    flex.setProviders({
      PasteThemeProvider: CustomizationProvider,
    });

    // register custom notifications with Flex manager
    registerNotifications(manager);

    // add the side panel icon from the AgentExtensionView only for supervisors
    if (!isAgentRole()) {
      flex.SideNav.Content.add(
        <SideNavigationIcon key="agent-extension-sidenav-button" />,
        {
          sortOrder: 100,
        }
      );
    }

    // add a custom view, in this case the AgentExtensionsLogic
    flex.ViewCollection.Content.add(
      <View name="agent-extensions-view" key="agent-extensions-view">
        <AgentExtensionsLogic key="agent-extensions-view" />
      </View>
    );
  }
}
