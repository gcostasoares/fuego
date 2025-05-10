import "./App.scss";
import { MainHeader } from "./Layouts/Header/mainHeader";
import { StyleSheetManager } from "styled-components";
import { Outlet } from "@tanstack/react-router";
import { FooterTop } from "./Layouts/Footer/FooterTop";
import { FooterBottom } from "./Layouts/Footer/FooterBottom";

function App() {
  return (
    <StyleSheetManager>
      <div className="app-container">
        <MainHeader />
        <main className="main-content">
          <Outlet /> {/* This will render the StrainsPage when on /strains */}
        </main>
        <FooterTop />
        <FooterBottom />
      </div>
    </StyleSheetManager>
  );
}

export default App;