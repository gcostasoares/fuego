import { useEffect } from "react";
import * as CookieConsent from "vanilla-cookieconsent";
import pluginConfig from "./CookieConsentConfig";

const CookieConsentComponent = () => {
  useEffect(() => {
    CookieConsent.run(pluginConfig);
  }, []);

  return (
    <></>
    // <a to="#" onClick={CookieConsent.showPreferences}>
    //   Show Cookie Preferences
    // </a>
  );
};

export default CookieConsentComponent;
