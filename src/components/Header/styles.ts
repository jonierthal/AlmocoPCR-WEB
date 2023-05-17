import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

export const LogoContainer = styled.div`
    display: flex;  
    justify-content: center;
    border-bottom: 1px solid #0476AC;
`;

export const LogoImg = styled.img`
    width: 8rem;
    height: auto;
`;

export const ButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    gap:3rem;

    margin-top: 1.25rem;
  `;

export const NavLinkButton = styled(NavLink)`
    width: auto;

    font-weight:bold;
    font-family: Arial;
    color: #0476AC;
    text-decoration: none;

    border-top: 3px solid transparent;
    border-bottom: 3px solid transparent;

    cursor: pointer;

    &.active {
        border-bottom: 3px solid #9546AC;
        color: #9546AC;
    }

`;



