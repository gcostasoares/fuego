// BackToTopButton.jsx
import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import styled from "styled-components";

interface ButtonProps {
  $visible?: "visible" | "none";
}

const Button = styled.button<ButtonProps>`
  position: fixed;
  bottom: 40px;
  right: 22px;
  background-color: #d7c9b2;
  color: #000;
  border: none;
  border-radius: 50%;
  padding: 0.8rem;
  font-size: 1.5rem;
  height: 40px;
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  opacity: ${({ $visible }) => ($visible === "visible" ? "1" : "0")};
  transform: ${({ $visible }) =>
    $visible === "visible" ? "scale(1)" : "scale(0.5)"};
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);

  &:hover {
    background-color: #15ae24;
  }
`;

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState<"visible" | "none">("none");

  // Show button when the user scrolls down 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible("visible");
      } else {
        setIsVisible("none");
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll smoothly to the top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Button onClick={scrollToTop} $visible={isVisible}>
      <ChevronUp />
    </Button>
  );
};

export default BackToTopButton;
