import { THead, Th, Tr } from '@twilio-paste/core';
import NewExtButton from '../../NewExtension/NewExtensionButton/NewExtensionsButton';

const TableHeader = ({ isNewExtButtonVisible, clickHandler }) => {
  return (
    <THead>
      <Tr>
        <Th>Agent Name</Th>
        <Th>Agent Extension</Th>
        <Th>Worker SID</Th>
        <Th textAlign="right">
          {isNewExtButtonVisible && (
            <NewExtButton clickHandler={clickHandler}></NewExtButton>
          )}
        </Th>
      </Tr>
    </THead>
  );
};

export default TableHeader;
