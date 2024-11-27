import styled from "styled-components";

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

export const ErrorsMessage = styled.span`
    margin-top: 1rem;

    text-align: center;
    font-size: 0.9rem;
    font-family: Arial;
    color: #FF0000	
`;

export const TextAlertContainer = styled.span`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    margin-bottom: 1rem;
`;

