import { Alert, Text } from '@twilio-paste/core';

const Alerts = ({
  isPublishButtonVisible,
  publishState,
  isVersionMismatch,
  fetchAsset,
}) => {
  return (
    <>
      {isPublishButtonVisible && (
        <>
          {publishState === 0 && !fetchAsset && (
            <Alert variant="warning">
              <Text as="span">
                There are unpublished Agent extensions. Please publish them to
                allow your customers to use them in the IVR!
              </Text>
            </Alert>
          )}
          {publishState < 2 && isVersionMismatch && (
            <Alert variant="error">
              <Text as="span">
                Another agent extension publish is in progress. Publishing now
                will overwrite other changes.
              </Text>
            </Alert>
          )}
          {publishState === 2 && (
            <Alert variant="error">
              <Text as="span">
                Agent extensions were updated by someone else and cannot be
                published. Please reload and try again.
              </Text>
            </Alert>
          )}
          {publishState === 3 && (
            <Alert variant="error">
              <Text as="span">Agent extensions publish failed.</Text>
            </Alert>
          )}
          {publishState === 4 && (
            <Alert variant="error">
              <Text as="span">
                Switch to a non-available activity to publish your agent
                extensions. This prevents you from receiving a task during the
                publish process.
              </Text>
            </Alert>
          )}
        </>
      )}
    </>
  );
};

export default Alerts;
