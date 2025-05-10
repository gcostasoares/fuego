import { Logos } from "@/types/logos";
import { ShopDescription } from "@/types/shopDescription";
import styled from "styled-components";

const LogoCard = styled.div`
  background-color: #ecf0eb;
  padding: 10px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  width: 90%;
  img {
    max-width: 150px;
    max-height: 70px;
    object-fit: contain;
  }

  @media (min-width: 768px) {
    width: 90%;
  }
`;
export interface IFeatureProps {
  logos?: Logos[];
  shopDescriptions?: ShopDescription[];
  shopSectionTitle?: string;
  shopSectionDescription?: string;
}
const LogoSliderSection = ({ logos }: IFeatureProps) => {
  return (
    <>
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateX(0%);
            }
            100% {
              transform: translateX(-100%);
            }
          }

          .scrolling-container {
            display: flex;
            overflow: hidden;
            white-space: nowrap;
            position: relative;
          }

          .scrolling-content {
            display: flex;
            animation: scroll 30s linear infinite;
          }
        `}
      </style>

      <div className="scrolling-container z-10">
        <div className="scrolling-content">
          {logos?.map((logo) => (
            <div
              key={logo.id}
              className="basis-[1/1.5] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex-shrink-0 max-w-64"
            >
              <LogoCard>
                <img
                  src={logo.imagePath}
                  alt={logo.id.toString()}
                  loading="lazy"
                />
              </LogoCard>
            </div>
          ))}
          {logos?.map((logo) => (
            <div
              key={`duplicate-${logo.id}`}
              className="basis-[1/1.5] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 flex-shrink-0 max-w-64"
            >
              <LogoCard>
                <img
                  src={logo.imagePath}
                  alt={logo.id.toString()}
                  loading="lazy"
                />
              </LogoCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default LogoSliderSection;
