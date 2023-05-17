import styled from 'styled-components';

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonComp = styled.button`
    width: 50%;
    height: auto;
    padding: 0.6rem;

    background-color: #0476AC;

    font-weight:bold;
    font-size: 1rem;
    font-family: Arial;
    color: #FFFF;

    border:none; ;
    border-radius: 0.3rem;

    cursor: pointer;

    margin: 0.125rem;

    &:active {
        transform: translateY(2px); /* Desloca o botão para baixo quando pressionado */
        box-shadow: none; /* Remove a sombra do botão quando pressionado */
        background: #0489AC;
    }

    &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

`;