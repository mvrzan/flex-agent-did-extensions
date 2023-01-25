import { Stack } from '@twilio-paste/core/stack';
import { Text } from '@twilio-paste/core/text';
import { Heading } from '@twilio-paste/core/heading';
import { Modal, ModalBody } from '@twilio-paste/core/modal';
import { Spinner } from '@twilio-paste/core/spinner';
import { PublishModalContent } from '../AgentExtensionsView/AgentExtensionsViewStyles';

const ModalView = ({ isOpen }) => {
  return (
    <Modal
      isOpen={isOpen}
      onDismiss={() => {}}
      size="default"
      ariaLabelledby=""
    >
      <ModalBody>
        <PublishModalContent>
          <Stack orientation="horizontal" spacing="space60">
            <Spinner
              decorative={true}
              size="sizeIcon100"
              title="Please wait..."
            />
            <Stack orientation="vertical" spacing="space20">
              <Heading as="h3" variant="heading30" marginBottom="space0">
                Publishing Agent Extensions
              </Heading>
              <Text as="p">This may take a few moments, please wait...</Text>
            </Stack>
          </Stack>
        </PublishModalContent>
      </ModalBody>
    </Modal>
  );
};

export default ModalView;
