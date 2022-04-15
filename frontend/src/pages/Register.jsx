// CSS
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.css";

// REACT \ ROUTER
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

// PRIMEREACT COMPONENTS
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

// CUSTOM COMPONENTS
import Language from "../components/Language";

//CUSTOM FUNCTIONS
import { register } from "../api/userAPI";
import {displayPopup} from "../utils/popup";
import { translate } from "../utils/language";

const Register = () => {
  
  //Navigation
  const navigate = useNavigate();

  //Toast
  const toast = useRef(null);

  //States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("");


  //Handlers 
  const handleRegister = () => {
    register(username, password).then((res) => {
      if (res.data.type === "error") {
        displayPopup(toast, "error", translate(res.data.data), "");
        return;
      }
      navigate("/post/login");
    });
  };

  return (
    <div>
      <div className="col-12 text-end">
        <Button
          className="p-button-text p-button-sm mx-5"
          label={translate("LOGIN")}
          onClick={()=>navigate("/post/login")}
        />
        <Language onLanguageChange={setLanguage} />
      </div>
      <Toast ref={toast} />
      <div className="row justify-content-center mb-4">
        <div className="col-8">
          <h1 className="text-light text-center">{translate("REGISTER")}</h1>
        </div>
      </div>
      <div className="row justify-content-center mb-4">
        <div className="col-8 ">
          <Card>
            <span className="p-float-label mb-4">
              <InputText
                className="w-100"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="username">{translate("USERNAME")}</label>
            </span>
            <span className="p-float-label mb-4">
              <InputText
              type="password"
                className="w-100"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">{translate("PASSWORD")}</label>
            </span>
            <Button
              className="w-100 mb-2"
              label={translate("REGISTER")}
              icon="pi pi-user"
              iconPos="right"
              onClick={handleRegister}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Register;
