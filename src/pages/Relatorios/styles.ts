import { ListGroup } from 'react-bootstrap';
import styled from 'styled-components'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export const Container = styled.div`
    width: 100%;
`;

export const ButtonContainer = styled.span`
    margin-top:0.5rem
    //background-color:blue;
`;

export const Button = styled.button`
    padding: 0.6rem 1rem;
    background-color: #0476AC;
    font-weight:bold;
    font-size: 1rem;
    font-family: Arial;
    color: #FFFF;
    border:none;
    border-radius: 0.3rem;
    cursor: pointer;

    margin: 0.1rem 0.5rem;

    &:active {
        transform: translateY(2px); /* Desloca o botão para baixo quando pressionado */
        box-shadow: none; /* Remove a sombra do botão quando pressionado */
        background: #0489AC;
    }

    &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`
export const DateContainer = styled.div`
    display: flex;
    flex-direction: column;
    //align-items: center;
    margin-top: 0.5rem;
    //background-color:blue;
`

export const TextDateContainer = styled.div`
    display: flex;
    justify-content: space-around;
    //padding:0 1rem;
    //background-color:yellow;
`
export const ButtonDateIntervalContainer = styled.div`
    display: flex;
    justify-content: space-between;
    //background-color:green;
    margin-bottom:1rem;
`

export const StyledDatePicker = styled(DatePicker)`
  width: 150px;
  padding: 0.6rem 1rem;
  border: 1px solid #0476AC;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  text-align: center;
  color: #0476AC;
  font-weight:bold;
  font-size: 1rem;
  font-family: Arial;
  margin:0 0.5rem;
  
`;

export const TextDate = styled.text`
    color: #0476AC;
    font-weight:bold;
    font-size: 1.1rem;
    font-family: Arial;
`

export const RelatoriosContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 1rem;
    border-bottom: 1px solid #0476AC;
`

export const AutoEmailContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 1rem;
    padding: 1rem;
    border: 1px solid #0476AC;
    border-radius: 8px;
    background-color: #f4fbff;
`

export const AutoEmailTitle = styled.h3`
    margin: 0;
    color: #0476AC;
    font-weight: bold;
    font-size: 1.1rem;
    font-family: Arial;
`

export const AutoEmailText = styled.p`
    margin: 0;
    color: #0476AC;
    font-size: 1rem;
    font-family: Arial;
`

export const AutoEmailStatus = styled.span`
    color: #0476AC;
    font-weight: bold;
    font-size: 0.95rem;
    font-family: Arial;
`

export const AutoEmailInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: 0.6rem;
  border: 1px solid #0476AC;
  border-radius: 6px;
  color: #0476AC;
  font-size: 0.95rem;
  font-family: Arial;
  resize: vertical;
`;

export const ListsContainer = styled.div`
    display: flex;
    //align-items: center;
    justify-content: center;
    //background-color: red;
    padding: 1rem;
`

export const TableContainer = styled.div`
    display: flex;
    justify-content: center;
    padding: 1rem;
`

export const TableSpacing = styled.div`
    width: 100%;
    margin: 0 00.5rem;
`

export const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  border: 1px solid #000;
`

export const Thead = styled.thead`
  width: 100%;
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

  width: 100%;

  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

`;

export const Th2 = styled.th`
  background-color: #0476AC;
  border: 1px solid #FFFF;
  padding: 8px;

  text-align: center;
  color: #FFFF;
  font-weight:bold;
  font-size: 1rem;
  font-family: Arial;
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

export const Icon = styled.i`
  display: inline-block;
`;

export const ListaAlmocosContainer = styled.div`
    width: 100%;
    margin: 0 00.5rem;
`

export const ListaExtrasContainer = styled.div`
    width: 100%;
    margin: 0 00.5rem;
`

export const ListaXisContainer = styled.div`
    width: 100%;
    margin: 0 00.5rem;
`

export const ListGroupItem = styled(ListGroup.Item)`
&.active {
    background-color: #0476AC;
    border-color: #0476AC;
    color: #fff;
    font-weight: bold;
  }

`;

export const ListGroupItemText = styled(ListGroup.Item)`
    color: #0476AC;
    font-weight: bold;
`;

export const ContainerTextFooter = styled.div`
    //background-color: red;
    display: flex;
    align-items: end;
    justify-content: center;
    margin-top: 2rem;
`;

export const SpinnerContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top:1rem
`;
