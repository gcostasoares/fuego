import { Button } from "@/components/ui/button";
import styled from "styled-components";

export const HeaderWrapper = styled.header`
  background-color: #333333;
`;

export const HeaderLogoWrap = styled.div`
  padding: 0px 38px;
`;

export const HeaderMenuWrap = styled.div`
  padding: 20px 38px;
`;

export const OutlineButton = styled(Button)`
  padding: 6px 14px;
  border: 2px solid #0e0e0e;
  border-radius: 50px;
  width:150px;
  color: #333333;
  cursor: pointer;
  &:hover {
    background-color: #000000;
    color: #fff;
  }
`;

export const CustomButton = styled(Button)`
  border-radius: 25px;
  font-weight: bold;
  background-color: #16af25;
  text-transform: captilaze;
  border-color: #16af25;
  padding: 10px 35px;
  font-weight: 500;
  &:hover {
    background-color: #fff;
    border-color: #fff;
    color: black;
  }
`;

export const LoginMenuButton = styled(CustomButton)`
  background-color: transparent;
  border-color: #c4c4c4;
  padding: 8px 35px;
`;

export const DisplayStart = styled.div<{
  gap?: string;
}>`
  width: auto;
  gap: ${(props) => (props.gap ? props.gap : null)};
  display: flex;
  justify-content: start;
`;

export const Box = styled.div<{}>`
  display: block;
`;
