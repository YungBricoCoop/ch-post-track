import { saveLanguage, getLanguage } from "./localStorage";
import translation from "../data/translations";

const languages = [
    { language: "EN", flagCode: "GB" },
    { language: "FR", flagCode: "FR" },
    { language: "DE", flagCode: "DE" },
    { language: "IT", flagCode: "IT" },
  ];

const getCurrentLanguage = () => {
    let language = getLanguage();
    if (language === null) {
        language = "EN";
    }
    return languages.find(lang => lang.language === language);
}


const translate = (key) => {
    return translation[getCurrentLanguage().language][key];
}

  export { languages, saveLanguage, getCurrentLanguage, translate  };