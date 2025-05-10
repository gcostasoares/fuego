import styled from "styled-components";
import BackToTopButton from "../../components/BackToTopButton";
import { Link } from "@tanstack/react-router";
import { Link2Icon } from "lucide-react";

export const FooterBottom = () => {
  return (
    <FooterContainer>
      <IconContainer>
        <Icon>
          <Link2Icon />
        </Icon>
        <BackToTopButton />
      </IconContainer>
      <FooterLinks>
        <Link to="/imprint">Impressum</Link>
        <Link to="/policies/data-privacy">Datenschutz</Link>
        <Link to="/policies/terms-of-use">AGB</Link>
      </FooterLinks>
      <FooterText className="font-bold">
        © Copyright {new Date().getFullYear()} Fuego | Alle Rechte vorbehalten
      </FooterText>
      <FooterText className="italic">
        *Rechtliche und medizinische Hinweise: Die Informationen auf dieser
        Seite beruhen auf Angaben und Erfahrungen unserer Nutzer und sind kein
        Ersatz für professionelle medizinische Beratung.
      </FooterText>
    </FooterContainer>
  );
};

const FooterContainer = styled.footer`
  background-color: #303030;
  border-top: 1px solid #54524f;
  color: #bcbcbc;
  padding: 4px 0px 40px;
  font-size: 0.85em;
  text-align: center;
  position: relative;
  width: 100%;
`;

const FooterLinks = styled.div`
  margin: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    color: #bcbcbc;
    margin: 0 2px;
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }

  a:not(:last-child)::after {
    content: "|";
    margin-left: 10px;
    color: #bcbcbc; // Color for the separator line
  }
`;

const FooterText = styled.p`
  color: #bcbcbc;
  margin: 5px 0;
`;

const IconContainer = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #ebebeb;
  color: #333333;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2em;
  cursor: pointer;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
`;
