import { TitleContainer, Title } from "./styles";

interface TitleProps {
    title: string;
}

export function TitleComp({ title} : TitleProps) {
    return (
        <TitleContainer>
            <Title >
                {title}
            </Title>
        </TitleContainer>
    );
}