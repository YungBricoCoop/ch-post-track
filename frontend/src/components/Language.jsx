import "../css/flags.css";
import fPlaceholder from "../images/flag/flag_placeholder.png";
import { Dropdown } from "primereact/dropdown";

import { useEffect, useState, useRef } from "react";

import { languages, saveLanguage, getCurrentLanguage } from "../utils/language";

const Language = (props) => {

  const [selectedLanguage, setSelectedLanguage] = useState(null);


    useEffect(() => {
        handleLanguageChange(getCurrentLanguage());
    },[])

  const selectedLanguageTemplate = (option, props) => {
    if (option) {
      return (
        <div className="language-item language-item-value">
          <img
            alt={option.language}
            src={fPlaceholder}
            className={`flag flag-${option.flagCode.toLowerCase()}`}
          />
        </div>
      );
    }
    return <span>{props.placeholder}</span>;
  };

  const languageOptionTemplate = (option) => {
    return (
      <div className="language-item">
        <img
          alt={option.language}
          src={fPlaceholder}
          className={`flag flag-${option.flagCode.toLowerCase()}`}
        />
      </div>
    );
  };

  const handleLanguageChange = (e) => {
      if("onLanguageChange" in props){
        props.onLanguageChange(e.language);
      }
    setSelectedLanguage(e);
    saveLanguage(e.language);
  };

  return (
    <Dropdown
      value={selectedLanguage}
      options={languages}
      onChange={(e) => handleLanguageChange(e.value)}
      optionLabel="language"
      placeholder="Language"
      valueTemplate={selectedLanguageTemplate}
      itemTemplate={languageOptionTemplate}
    />
  );
};

export default Language;
