import { Notifications, NotificationType } from '@twilio/flex-ui';

const registerExtensionAlreadyExists = manager => {
  manager.strings.extensionAlreadyExists =
    'Agent Extension already exists! Agent "{{errorString}}" has the extension already configured!';
  Notifications.registerNotification({
    id: 'extensionAlreadyExists',
    content: 'extensionAlreadyExists',
    closeButton: true,
    timeout: 3000,
    type: NotificationType.warning,
  });
};

const registerExtDeleted = manager => {
  manager.strings.extDeleted = 'Extension has been successfully deleted!';
  Notifications.registerNotification({
    id: 'extDeleted',
    content: 'extDeleted',
    closeButton: true,
    timeout: 1000,
    type: NotificationType.warning,
  });
};

const registerExtensionUpdatedSuccessfully = manager => {
  manager.strings.extensionUpdatedSuccessfully =
    'Extension configured successfully!';
  Notifications.registerNotification({
    id: 'extensionUpdatedSuccessfully',
    content: 'extensionUpdatedSuccessfully',
    closeButton: true,
    timeout: 1000,
    type: NotificationType.success,
  });
};

const registerNotifications = manager => {
  registerExtensionAlreadyExists(manager);
  registerExtensionUpdatedSuccessfully(manager);
  registerExtDeleted(manager);
};

export default registerNotifications;
