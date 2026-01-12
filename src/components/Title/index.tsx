import { TitleContainer, TitleComp} from "./styles";

interface TitleProps {
    title: string;
}

export function Title({ title} : TitleProps) {
    return (
        <TitleContainer>
            <TitleComp>
                {title}
            </TitleComp>
        </TitleContainer>
    );
}