import { Col,  Container, Row  } from "react-bootstrap";
import styled                  from "styled-components";
import { DisplayStart }        from "../../Styles/StyledComponents";
import { IFeatureProps }       from "@/components";

const Card = styled.div`
  text-align: center;
  padding: 10px;
  color: #ffffff;
`;

const IconWrapper = styled.div`
  background: #f5b60a;
  color: #000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const ImageWrap = styled.img`
  height: 100px;
  margin-bottom: 15px;
  object-fit: contain;
`;

const Title = styled.h3`
  font-size: 18px;
  color: #ffffff;
`;

const Description = styled.p`
  font-size: 14px;
  color: #b0b0b0;
`;

const FALLBACK_IMG = "/images/1.png";          // any placeholder you like

export const FeatureStepper = ({ shopDescriptions }: IFeatureProps) => {
  if (!shopDescriptions?.length) return null;

  return (
    <Container>
      <Row>
        {shopDescriptions.map((item, i) => (
          <Col md={6} key={item.id}>
            <Card>
              <div className="flex justify-center">
                <IconWrapper>{i + 1}</IconWrapper>

                <DisplayStart gap="50px" className="align-items-start row">
                  <ImageWrap
                    src={item.imagePath}
                    alt={item.title}
                    loading="lazy"
                    onError={e => {
                      (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                    }}
                  />
                  <Title>{item.title}</Title>
                </DisplayStart>
              </div>

              <Description>{item.description}</Description>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};
