import { TBody, Td, Th, Tr } from '@twilio-paste/core';

const LoadingScreen = () => {
  return (
    <TBody>
      <Tr>
        <Th>
          <Td>Loading...</Td>
        </Th>
      </Tr>
    </TBody>
  );
};

export default LoadingScreen;
