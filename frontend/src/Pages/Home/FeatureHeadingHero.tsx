import styled from "styled-components";

const Container = styled.div`
  background-color: #020f0a;
  color: #ffffff;
  padding: 50px 20px;
  text-align: center;
`;

const Heading = styled.h1`
  font-size: 50px;
  font-weight: 700;
  line-height: 1.2;
  max-width: 790px;
  margin: 0 auto;

  /* Responsive font size for smaller screens */
  @media (max-width: 768px) {
    font-size: 36px;
  }
  @media (max-width: 480px) {
    font-size: 28px;
  }
  @media (max-width: 360px) {
    font-size: 24px;
  }
`;

const Description = styled.p`
  font-size: 18px;
  font-weight: 400;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
  color: #b0b0b0;

  /* Responsive font size for smaller screens */
  @media (max-width: 768px) {
    font-size: 16px;
  }
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

interface IHeadingProps {
  shopSectionTitle?: string;
  shopSectionDescription?: string;
}
export const FeatureHeadingHero = ({
  shopSectionTitle,
  shopSectionDescription,
}: IHeadingProps) => {
  return (
    <>
      <Container>
        <Heading className="animate__animated animate__bounceInDown">
          {shopSectionTitle}
        </Heading>
        <Description className="animate__animated animate__bounceInDown">
          {shopSectionDescription}
        </Description>
      </Container>
    </>
  );
};
