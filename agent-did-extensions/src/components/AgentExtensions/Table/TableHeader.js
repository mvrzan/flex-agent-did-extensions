import { THead, Th, Tr } from '@twilio-paste/core';

const TableHeader = () => {
  return (
    <THead>
      <Tr>
        <Th>Agent Name</Th>
        <Th>Agent Extension</Th>
        <Th>Worker SID</Th>
        <Th />
      </Tr>
    </THead>
  );
};

export default TableHeader;
