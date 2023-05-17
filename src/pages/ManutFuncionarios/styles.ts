import styled from 'styled-components'
import Modal from 'react-modal';
import Alert from 'react-bootstrap/Alert';

export const StyledAlert = styled(Alert)`
  text-align: center;
  width: 100%;
`;

export const TableContainer = styled.div`
  margin-top: 1rem;
  margin-bottom: 3rem;
`;

export const Table = styled.table`
  border-collapse: collapse;
  width: 80%;
  margin: 0 auto;
`;

export const Th = styled.th`
  background-color: #0476AC;
  border: 1px solid #FFFF;
  padding: 8px;

  text-align: center;
  color: #FFFF;
  font-weight:bold;
  font-size: 1rem;
  font-family: Arial;
`;

export const ThMenor = styled.th`
  background-color: #0476AC;
  border: 1px solid #FFFF;
  padding: 8px;

  text-align: center;
  color: #FFFF;
  font-weight:bold;
  font-size: 1rem;
  font-family: Arial;

  width: 10%;

  &:first-child {
        border-top-left-radius: 8px;
        padding-left: 1.5rem;
      }

  &:last-child {
    border-top-right-radius: 8px;
    padding-right: 1.5rem;
  }
`;

export const Td = styled.td`
  border: 1px solid #ddd;
  padding: 5px;

  color: #0476AC;
  font-weight:bold;
  font-size: 1rem;
  font-family: Arial;
  text-align: center;
  vertical-align: middle;
`;

export const Icon = styled.i`
  display: inline-block;
`;

export const ButtonGreen = styled.button`
    width: 100%;
    height: auto;
    padding: 0.6rem;

    background-color: #228B22;

    font-weight:bold;
    font-size: 1rem;
    font-family: Arial;
    color: #FFFF;

    border:none; ;
    border-radius: 0.3rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    &:active {
        transform: translateY(2px); /* Desloca o botão para baixo quando pressionado */
        box-shadow: none; /* Remove a sombra do botão quando pressionado */
        background: #32CD32;
    }

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
`
export const ButonContainer = styled.div`
  margin-top: 0.5rem;
`

export const ButtonRed = styled.button`
    width: 100%;
    height: auto;
    padding: 0.6rem;

    background-color: #FF0000;

    font-weight:bold;
    font-size: 1rem;
    font-family: Arial;
    color: #FFFF;

    border:none; ;
    border-radius: 0.3rem;

    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    &:active {
        transform: translateY(2px); /* Desloca o botão para baixo quando pressionado */
        box-shadow: none; /* Remove a sombra do botão quando pressionado */
        background: #FF8C00;
    }
`;

export const TextAlertContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:1rem
`;

export const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 1rem;
    margin-bottom: 2rem;
`;

export const Input = styled.input`
    text-align: center;
    font-size: 1rem;
    font-family: Arial;
    font-weight: bold;

    color: #0476AC;

    border-radius: 0.3rem;
    border: 2px solid;
    border-color:#0476AC;

    width: 60%;
    
    padding: 0.5rem;

    ::placeholder {
        color: #0476AC;
    }
`;

