import { FC } from "react";
import { HeaderTop } from "./headerTop";
import { NavbarMenu } from "./navbarMenu";
import { HeaderWrapper } from "../../Styles/StyledComponents";

interface IProps {}
export const MainHeader: FC<IProps> = ({}) => {
  return (
    <HeaderWrapper>
      <HeaderTop />
      {/* Desktop Navbar Menu */}
      <div className="hidden lg:block">
        <NavbarMenu />
      </div>
    </HeaderWrapper>
  );
};
