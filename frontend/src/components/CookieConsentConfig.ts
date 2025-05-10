import type { CookieConsentConfig } from "vanilla-cookieconsent";

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box wide",
      position: "bottom right",
      equalWeightButtons: true,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "bar wide",
      position: "left",
      equalWeightButtons: true,
      flipButtons: false,
    },
  },

  // onFirstConsent: function () {
  //   console.log("onFirstAction fired");
  // },

  // onConsent: function ({ cookie }) {
  //   console.log("onConsent fired ...", cookie);
  // },

  // onChange: function ({ changedCategories, cookie }) {
  //   console.log("onChange fired ...", changedCategories, cookie);
  // },

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    analytics: {
      autoClear: {
        cookies: [
          {
            name: /^(_ga|_gid)/,
          },
        ],
      },
    },
  },

  language: {
    default: "en",
    autoDetect: "browser",
    translations: {
      en: {
        consentModal: {
          title: "Manage consent",
          description:
            'To provide the best experience, we use technologies such as cookies to store and/or access device information. If you consent to these technologies, we may process data such as browsing behavior or unique IDs on this website. If you do not consent or withdraw your consent, certain functions and features may be impaired.',
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
          //closeIconLabel: 'Close',
          footer: `
            <a to="/policies/data-privacy">Privacy Policy</a>
            <a href="/imprint">Impressum</a>
          `,
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Cookie Usage",
              description:
                'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a to="#" class="cc__link">privacy policy</a>.',
            },
            {
              title: "Strictly necessary cookies",
              description: "Description",
              linkedCategory: "necessary",
            },
            {
              title: "Performance and Analytics cookies",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "_ga",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a to="#das">Google Analytics</a>.',
                    expiration: "Expires after 12 days",
                  },
                  {
                    name: "_gid",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a to="#das">Google Analytics</a>',
                    expiration: "Session",
                  },
                ],
              },
            },
            {
              title: "More information",
              description:
                'For any queries in relation to my policy on cookies and your choices, please <a class="cc__link" to="#yourdomain.com">contact me</a>.',
            },
          ],
        },
      },
      de: {
        consentModal: {
          title: "Einwilligung verwalten",
          description:
            "Um das beste Erlebnis zu bieten, verwenden wir Technologien wie Cookies, um Geräteinformationen zu speichern und/oder darauf zuzugreifen. Wenn Sie diesen Technologien zustimmen, können wir Daten wie das Surfverhalten oder eindeutige IDs auf dieser Website verarbeiten. Wenn Sie nicht zustimmen oder Ihre Zustimmung widerrufen, kann dies zu einer Beeinträchtigung bestimmter Funktionen und Merkmale führen.",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          showPreferencesBtn: "Manage preferences",
          //closeIconLabel: 'Close',
          footer: `
            <a to="/policies/data-privacy">Privacy Policy</a>
            <a href="/imprint">Impressum</a>
          `,
        },
        preferencesModal: {
          title: "Cookie preferences",
          acceptAllBtn: "Accept all",
          acceptNecessaryBtn: "Reject all",
          savePreferencesBtn: "Save preferences",
          closeIconLabel: "Close",
          sections: [
            {
              title: "Cookie Usage",
              description:
                'I use cookies to ensure the basic functionalities of the website and to enhance your online experience. You can choose for each category to opt-in/out whenever you want. For more details relative to cookies and other sensitive data, please read the full <a to="#" class="cc__link">privacy policy</a>.',
            },
            {
              title: "Strictly necessary cookies",
              description: "Description",
              linkedCategory: "necessary",
            },
            {
              title: "Performance and Analytics cookies",
              linkedCategory: "analytics",
              cookieTable: {
                headers: {
                  name: "Name",
                  domain: "Service",
                  description: "Description",
                  expiration: "Expiration",
                },
                body: [
                  {
                    name: "_ga",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a to="#das">Google Analytics</a>.',
                    expiration: "Expires after 12 days",
                  },
                  {
                    name: "_gid",
                    domain: "Google Analytics",
                    description:
                      'Cookie set by <a to="#das">Google Analytics</a>',
                    expiration: "Session",
                  },
                ],
              },
            },
            {
              title: "More information",
              description:
                'For any queries in relation to my policy on cookies and your choices, please <a class="cc__link" to="#yourdomain.com">contact me</a>.',
            },
          ],
        },
      },
    },
  },
};

export default pluginConfig;
