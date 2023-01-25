import { SideLink, Actions } from '@twilio/flex-ui';

const SideNavigationIcon = ({ activeView }) => {
  const navigateHandler = () => {
    Actions.invokeAction('NavigateToView', {
      viewName: 'agent-extensions-view',
    });
  };

  return (
    <SideLink
      showLabel={true}
      icon="Directory"
      iconActive="DirectoryBold"
      onClick={navigateHandler}
      isActive={activeView === 'agent-extensions-view'}
      key="MyCustomPageSideLink"
    >
      Agent DID Extensions
    </SideLink>
  );
};

export default SideNavigationIcon;
