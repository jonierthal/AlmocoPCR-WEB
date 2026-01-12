import styled from 'styled-components';
import Modal from 'react-modal';
import Alert from 'react-bootstrap/Alert';

export const StyledAlert = styled(Alert)`
  text-align: center;
  width: 100%;
`;

export const ContainerModal = styled(Modal)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #F0FFFF;
  border-radius: 10px;
  border: 2px solid #0476AC;
  padding: 20px;
  width: 40%;
`;