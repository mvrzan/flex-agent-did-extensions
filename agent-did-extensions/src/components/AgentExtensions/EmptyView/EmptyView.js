import { TBody, Tr, Td } from '@twilio-paste/core';

const EmptyView = () => {
  return (
    <TBody>
      <Tr>
        <Td>There are no configured Agent extensions!</Td>
      </Tr>
    </TBody>
  );
};

export default EmptyView;
