// src/components/HeaderTop.jsx
import { Link } from "@tanstack/react-router";
import { FC, useState, useEffect } from "react";
import { Col,  Nav, Navbar  } from "react-bootstrap";
import styled from "styled-components";
import { LoginForm } from "../../components";
import { RegisterPopupForm } from "../../components/RegisterPopupForm";
import {
  DisplayStart,
  HeaderLogoWrap,
  LoginMenuButton,
} from "../../Styles/StyledComponents";
import { Logo } from "./Logo";
import { NavbarMenu } from "./navbarMenu";

interface IProps {}

const NavbarMenuWrap = styled(Nav)`
  background-color: #303434;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    align-items: start;
  }
`;

export const HeaderTop: FC<IProps> = () => {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [loginModal, setLoginModal] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    window.location.reload();
  };

  return (
    <HeaderLogoWrap>
      <Navbar
        expand="lg"
        variant="light"
        expanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        {/* Logo */}
        <Navbar.Brand as={Link} to="/">
          <div className="flex align-items-center">
            <Logo />
          </div>
        </Navbar.Brand>

        {/* Toggle Button for Mobile */}
        <Navbar.Toggle
          aria-controls="navbarResponsive"
          className="bg-white text-white"
          onClick={() => setExpanded(!expanded)}
        />

        <Navbar.Collapse id="navbarResponsive" className="justify-end">
          <DisplayStart gap="18px" className="d-lg-flex">
            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ color: "white", fontWeight: "bold" }}>
                  {user.username}
                </span>
                <LoginMenuButton className="btn mb-2" onClick={handleLogout}>
                  LOGOUT
                </LoginMenuButton>
              </div>
            ) : (
              <>
                <LoginMenuButton
                  className="btn mb-2"
                  onClick={() => setLoginModal(true)}
                >
                  LOGIN
                </LoginMenuButton>
                <LoginForm
                  show={loginModal}
                  setShow={setLoginModal}
                  onRegisterClick={() => {
                    setLoginModal(false);
                    setOpenRegister(true);
                  }}
                />
                <RegisterPopupForm
                  show={openRegister}
                  setShow={setOpenRegister}
                  onLoginClick={() => {
                    setOpenRegister(false);
                    setLoginModal(true);
                  }}
                />
                <LoginMenuButton
                  className="btn mb-2"
                  onClick={() => setOpenRegister(true)}
                >
                  REGISTRIEREN
                </LoginMenuButton>
              </>
            )}
          </DisplayStart>
          <NavbarMenuWrap className="d-lg-none">
            <NavbarMenu />
          </NavbarMenuWrap>
        </Navbar.Collapse>
      </Navbar>
    </HeaderLogoWrap>
  );
};
