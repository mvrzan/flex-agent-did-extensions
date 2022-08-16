import styled from 'react-emotion';
import { Flex, Th, Td, Input, Box } from '@twilio-paste/core';
import { TableCell, TextField } from '@material-ui/core';

export const Caption = styled('div')`
  font-size: 12px;
  margin: 12px;
  font-weight: bold;
`;
export const AttributeTableCell = styled(Th)`
  font-size: 12px;
  padding: 0px 12px 0px 12px
  height: 32px;
  width: 100px;
`;

export const AttributeName = styled('div')`
  font-size: 12px;
  margin: 0px 6px 0px;
`;

export const AttributeTextField = styled(Input)`
  flex: 0 0 0px;
  height: 32px;
  width: 180px;
`;

export const Container = styled(Flex)`
  font-size: 12px;
  margin-bottom: 4px;
  margin-left: 4px;
  margin-right: 4px;
`;

export const ButtonsContainer = styled('div')`
  margin-top: 24px;
  padding-left: 80px;
  padding-right: 12px;
  justify-content: right;
  align: center;
`;
