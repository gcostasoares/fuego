import styled from "styled-components";
import LogoSliderSection, {
  IFeatureProps,
} from "../../components/LogoSliderSection";
import { FeatureHeadingHero } from "./FeatureHeadingHero";
import { FeatureStepper } from "./FeatureStepper";

const HeroContainer = styled.section`
  position: relative;
  padding: 20px 0 120px 0px;
  background-color: #020f0a;
`;

export const AbsoluteLogoSlider = styled.div`
  position: absolute;
  width: 100%;
  left: 0;

  /* Top LogoSlider */
  &.top {
    top: -55px;
  }

  /* Bottom LogoSlider */
  &.bottom {
    bottom: -170px;
    height: 210px;

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      height: 220px;
    }

    @media (max-width: 768px) {
      height: 200px;
    }

    @media (max-width: 480px) {
      height: 190px;
    }
  }
`;

export const FeatureSection = ({
  logos,
  shopDescriptions,
  shopSectionTitle,
  shopSectionDescription,
}: IFeatureProps) => {
  return (
    <HeroContainer>
      {/* HeroSection in the center */}
      <FeatureHeadingHero shopSectionTitle={shopSectionTitle} shopSectionDescription={shopSectionDescription} />
      <FeatureStepper shopDescriptions={shopDescriptions} />

      {/* LogoSlider at the bottom */}
      <AbsoluteLogoSlider className="bottom">
        <LogoSliderSection logos={logos || []} />
      </AbsoluteLogoSlider>
    </HeroContainer>
  );
};
