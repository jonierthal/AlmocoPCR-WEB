import styled from 'styled-components';

export const Fieldset = styled.fieldset`
    border: 2px solid #0476AC;
    border-radius: 0.25rem;
    padding: 1rem;
    width: 50%;
    margin: 0 auto;
    margin-top: 4rem;
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

    width: auto;
    
    padding: 0.5rem;

    ::placeholder {
        color: #0476AC;
    }
`;

export const StyledSelect = styled.select`
    text-align: center;
    font-size: 1rem;
    font-family: Arial;
    font-weight: bold;

    color: #0476AC;

    border-radius: 0.3rem;
    border: 2px solid;
    border-color: #0476AC;

    width: auto;
    padding: 0.5rem;
    padding-right: 2rem; /* espaço para a seta */

    appearance: none; /* Remove o estilo padrão do select */
    background-color: white;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cpath fill='%230476AC' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.7rem center;
    background-size: 1rem;

    &:focus {
        outline: none;
        box-shadow: 0 0 5px rgba(4, 118, 172, 0.5);
    }
`;


