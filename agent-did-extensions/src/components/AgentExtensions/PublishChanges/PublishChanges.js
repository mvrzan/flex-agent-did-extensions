import { Button } from '@twilio-paste/core';

const PublishChanges = ({
  isPublishButtonVisible,
  publishExtensionsHandler,
  publishAgentExtensions,
  fetchAsset,
}) => {
  return (
    <Button
      variant="outlined"
      disabled={!isPublishButtonVisible}
      onClick={() => publishExtensionsHandler(publishAgentExtensions)}
      loading={fetchAsset}
    >
      Publish Extensions
    </Button>
  );
};

export default PublishChanges;
