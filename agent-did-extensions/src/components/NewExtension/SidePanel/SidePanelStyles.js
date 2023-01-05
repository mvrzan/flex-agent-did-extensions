import { SidePanel } from '@twilio/flex-ui';
import styled from '@emotion/styled';

export const Container = styled('div')`
  display: flex;
  position: absolute;
  height: 100%;
  right: 0px;
  z-index: 10;
`;

export const StyledSidePanel = styled(SidePanel)`
  width: 500px;
`;
