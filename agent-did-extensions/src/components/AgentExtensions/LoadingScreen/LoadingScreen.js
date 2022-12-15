import { TBody, Td, Th, Tr } from '@twilio-paste/core';

const LoadingScreen = () => {
  return (
    <TBody>
      <Tr>
        <Th>
          <Td>Loading...</Td>
        </Th>
        <Th></Th>
        <Th></Th>
        <Th></Th>
      </Tr>
    </TBody>
  );
};

export default LoadingScreen;
