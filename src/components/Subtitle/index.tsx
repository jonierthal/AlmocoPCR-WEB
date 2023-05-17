import { TitleContainer, Title } from "./styles";

interface SubtitleProps {
    subtitle: string;
}

export function SubtitleComp({ subtitle} : SubtitleProps) {
    return (
        <TitleContainer>
            <Title >
                {subtitle}
            </Title>
        </TitleContainer>
    );
}