import { Badge } from '@twilio-paste/core/badge';
import { Spinner } from '@twilio-paste/core/spinner';
import { SuccessIcon } from '@twilio-paste/icons/esm/SuccessIcon';
import { ErrorIcon } from '@twilio-paste/icons/esm/ErrorIcon';

const SyncStatus = ({ fetchAsset, AssetLoadFailed }) => {
  return (
    <>
      {fetchAsset && (
        <Spinner
          decorative={true}
          size="sizeIcon40"
          color="$color-text-primary"
        />
      )}
      {!fetchAsset && !AssetLoadFailed && (
        <Badge as="span" variant="success">
          <SuccessIcon decorative />
          Current version deployed in production 😬
        </Badge>
      )}
      {!fetchAsset && AssetLoadFailed && (
        <Badge as="span" variant="warning">
          <ErrorIcon decorative />
          Current version only active in the UI 😱
        </Badge>
      )}
    </>
  );
};

export default SyncStatus;
