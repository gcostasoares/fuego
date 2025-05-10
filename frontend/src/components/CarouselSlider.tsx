import { Carousel } from "@/types/carousel";
import "animate.css";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./ui/loader";

// Styled components
const SliderContainer = styled.section`
  position: relative;
  width: 100%;
  height: 550px;
  margin: auto;
  overflow: hidden;
`;

const Slide = styled.div<{ "$-image": string; "$-active": number }>`
  background-image: url(${(props) => props["$-image"]});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: ${(props) => props["$-active"]};
  transition: opacity 1s ease-in-out;
  z-index: ${(props) => props["$-active"]};
`;

const SliderTextWrapper = styled.div`
  padding: 60px;
  width: 700px;

  /* Responsive styling */
  @media (max-width: 1024px) {
    /* Tablet view */
    width: 90%;
    padding: 52px;
  }

  @media (max-width: 600px) {
    width: 100%;
    padding: 40px;
  }
`;

// const Title = styled.h1`
//   top: 30px;
//   left: 20px;
//   color: white;
//   padding-bottom: 25px;
//   font-size: 48px;
//   font-weight: 700;
//
//   /* Responsive styling */
//   @media (max-width: 1024px) {
//     font-size: 2.5rem;
//   }
//
//   @media (max-width: 600px) {
//     font-size: 1.9rem;
//     top: 10px;
//     left: 10px;
//   }
// `;
//
// const SubTitle = styled.h6`
//   top: 20px;
//   left: 20px;
//   color: #e1b522;
//   padding-bottom: 10px;
//
//   /* Responsive styling */
//   @media (max-width: 600px) {
//     font-size: 1.2rem;
//     top: 10px;
//     left: 10px;
//   }
// `;
//
// const SlideDescription = styled.h6`
//   top: 20px;
//   left: 20px;
//   color: #fff;
//   padding-bottom: 70px;
//   font-size: 26px;
//
//   /* Responsive styling */
//   @media (max-width: 600px) {
//     font-size: 1.2rem;
//     top: 10px;
//     left: 10px;
//   }
// `;


interface ICarouselProps {
  carousels: Carousel[];
  loading: boolean;
}
export const CarouselSlider = ({ carousels, loading }: ICarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  useEffect(() => {
    if (carousels.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carousels.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [carousels]);

  return (
    <SliderContainer className="bg-[#333333] ">
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Loader />
        </div>
      ) : (
        carousels.map((slide, index) => (
          <Slide
            key={slide.id}
            $-image={slide.imagePath}
            $-active={index === currentIndex ? 1 : 0}
          >
            {index === currentIndex && (
              <>
                <SliderTextWrapper>
                  {/* <SubTitle>{slide.subTitle}</SubTitle> */}
                  {/* <Title>{slide.title}</Title> */}
                  {/* <Title>{slide.title}</Title> */}
                </SliderTextWrapper>
              </> 
            )}
          </Slide>
        ))
      )}
    </SliderContainer>
  );
};
