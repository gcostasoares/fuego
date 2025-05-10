import { Link } from "@tanstack/react-router";
import { FC } from "react";
import { Col,  Nav  } from "react-bootstrap";
import styled from "styled-components";


const HeaderMenuWrap = styled.div`
  padding-bottom: 3px;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: start;

  @media (max-width: 768px) {
    justify-content: start;
  }
`;

const NavbarMenuWrap = styled(Nav)`
  border-radius: 10px;
  display: flex;
  justify-content: space-between; 
  align-items: center;
  width: 90%; /* Ensure full width */

  @media (max-width: 768px) {
    align-items: start;
    padding: 8px 20px;
    gap: 4px;
    justify-content: start; 
  }
`;

const NavLink = styled(Link)`
  color: #faf9f6;
  font-weight: bold;
  font-size: 18px;
  border-radius: 10px;
  text-decoration: none;
  padding-top: 6px;
  padding-bottom: 6px;

  &:hover {
    color: #3ab54a;
  }

  &.active {
    color: #3ab54a;
    font-weight: bold;
  }
`;

interface IProps {}

export const NavbarMenu: FC<IProps> = ({}) => {
  return (
    <HeaderMenuWrap>
      <NavbarMenuWrap className="navbar-menu-wrap flex-wrap gap-3">
        <NavLink to="/" className="px-4">
          HOME
        </NavLink>
        <NavLink to="/products" className="px-4">
          CANNABISBLÜTEN
        </NavLink>
        {/* <NavLink to="/products/2" className="px-4">
          STRAINS
        </NavLink> */}
        <NavLink to="/doctors" className="px-4">
          ÄRZTE
        </NavLink>
        <NavLink to="/pharmacies" className="px-4">
          APOTHEKEN
        </NavLink>
        <NavLink to="/shop" className="px-4">
          CBD SHOPS
        </NavLink>
        <NavLink to="/merch" className="px-4">
          MERCH
        </NavLink>
        <NavLink to="/headShop" className="px-4">
          HEADSHOPS
        </NavLink>
        <NavLink to="/growEquipment" className="px-4">
          GROW-EQUIPMENT
        </NavLink>
      </NavbarMenuWrap>
    </HeaderMenuWrap>
  );
};
