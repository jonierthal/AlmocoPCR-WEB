import {  ButtonComp, ButtonContainer } from './styles';

interface ButtonProps {
    name?: string;
    type?: "button" | "submit" | "reset" ;
    value?: number;
}

export function Button({ name, type, value }: ButtonProps){
    return (
        <ButtonContainer>
            <ButtonComp type={type} value={value}> {name} </ButtonComp>
        </ButtonContainer>
    )
}