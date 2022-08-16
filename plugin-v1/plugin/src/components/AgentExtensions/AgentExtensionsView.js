import React from 'react';
import { SideLink, Actions } from '@twilio/flex-ui';
import * as flex from '@twilio/flex-ui';
import { View } from '@twilio/flex-ui';
import AgentExtensionsLogic from './AgentExtensionsLogic';
import { isAgentRole } from '../utils/workerUtil';

const AgentExtensionView = ({ activeView }) => {
  function navigate() {
    Actions.invokeAction('NavigateToView', {
      viewName: 'agent-extensions-view',
    });
  }

  return (
    <SideLink
      showLabel={true}
      icon="Directory"
      iconActive="DirectoryBold"
      onClick={navigate}
      isActive={activeView === 'agent-extensions-view'}
    >
      Agent Extensions
    </SideLink>
  );
};

if (!isAgentRole()) {
  flex.SideNav.Content.add(
    <AgentExtensionView key="agent-extension-sidenav-button" />,
    {
      sortOrder: 2,
    }
  );

  flex.ViewCollection.Content.add(
    <View name="agent-extensions-view" key="agent-extensions-view">
      <AgentExtensionsLogic key="agent-extensions-view" />
    </View>
  );
}

export default AgentExtensionView;
