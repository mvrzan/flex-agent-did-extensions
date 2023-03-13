import { THead, Th, Tr } from '@twilio-paste/core';

const TableHeader = () => {
  return (
    <THead stickyHeader top={2}>
      <Tr>
        <Th>Agent Name</Th>
        <Th>Agent Extension</Th>
        <Th>Worker SID</Th>
        <Th>Edit Actions</Th>
      </Tr>
    </THead>
  );
};

export default TableHeader;
