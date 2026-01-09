import {
  LogoContainer,
  LogoImg,
  ButtonContainer,
  NavLinkButton,
} from "./styles";
import Logo from "../../assets/LogoPCR.png";
import { NAV_ITEMS } from "../../routes/paths";

export function Header() {
  return (
    <>
        <LogoContainer>
          <LogoImg src={Logo} alt="Imagem PNG" />
        </LogoContainer>

        <ButtonContainer>
        {NAV_ITEMS.map((item) => (
          <NavLinkButton key={item.path} to={item.path} title={item.label}>
            <h5>{item.label}</h5>
          </NavLinkButton>
        ))}
      </ButtonContainer>
    </>

  );
}