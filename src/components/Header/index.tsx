import { LogoContainer, LogoImg, ButtonContainer, NavLinkButton } from "./styles";
import Logo from '../../assets/LogoPCR.png'
import { Button } from "../Button";

import { NavLink } from 'react-router-dom'

export function Header() {
  return (
    <>
        <LogoContainer>
            <LogoImg src={Logo} alt="Imagem PNG"  />
        </LogoContainer>

        <ButtonContainer>
            <NavLinkButton to="/" title="Cadastro">
              <h5> Cadastro de funcionários </h5>
            </NavLinkButton>
            <NavLinkButton to="/ManutFuncionarios" title="Cadastro">
              <h5> Manutenção de funcionários </h5>
            </NavLinkButton>
            <NavLinkButton to="/CadastroDepartamento" title="Cadastro">
              <h5> Cadastro de Deparatamento </h5>
            </NavLinkButton>
            <NavLinkButton to="/ManutDepartamentos" title="Cadastro">
              <h5> Manutenção de Departamento </h5>
            </NavLinkButton>
            <NavLinkButton to="/Relatorios" title="Cadastro">
            <h5> Relatórios </h5>
            </NavLinkButton>
        </ButtonContainer>
    </>

  )
}