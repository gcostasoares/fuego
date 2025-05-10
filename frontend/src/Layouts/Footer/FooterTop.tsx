import { Link } from "@tanstack/react-router";
import { Col,  Row  } from "react-bootstrap";
import styled from "styled-components";

const FooterWrapper = styled.footer`
  background-color: #303030;
  color: #ffffff;
  padding: 2rem 2rem 2rem;
`;

const LinkSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h4 {
    color: #ffffff;
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
  }

  a {
    color: #b0b0b0;
    text-decoration: none;
    font-size: 0.9rem;

    &:hover {
      color: #3ab54a;
    }
  }
`;

export const FooterTop = () => {
  return (
    <>
      <FooterWrapper>
        <Row className="justify-center pt-4">
          <Col md={1}></Col>
          <Col md={4} className="mb-4">
            <img
              loading="lazy"
              src="/images/home/fuego-new-logo.png"
              alt="logo"
              className="w-auto h-20 max-h-52 max-w-full"
            />
          </Col>

          <Col md={3} className="mb-4 pt-lg-5 pt-md-5">
            <LinkSection>
              <h4 className="font-bold">Preisvergleich</h4>
              <Link to="/products">Cannabisblüten</Link>
              <Link to="/">Telemedizin</Link>
              <Link to="/">Extrakte</Link>
              <Link to="/about">Über uns</Link>
            </LinkSection>
          </Col>

          <Col md={3} className="mb-4 pt-lg-5 pt-md-5">
            <LinkSection>
              <h4 className="font-bold">Cannabis</h4>
              <Link to="/pharmacies">Cannabis Apotheke</Link>
              <Link to="/doctors">Cannabis Arzte</Link>
              <Link to="/">Terpene Liste</Link>
            </LinkSection>
          </Col>
        </Row>
      </FooterWrapper>
    </>
  );
};
