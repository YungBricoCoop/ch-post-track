// CSS
import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.css";

// REACT \ ROUTER
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// PRIMEREACT COMPONENTS
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

// CUSTOM COMPONENTS
import Language from "../components/Language";

// CUSTOM FUNCTIONS
import { login, tokenLogin } from "../api/userAPI";
import { displayPopup } from "../utils/popup";
import { saveToken, getToken, removeToken } from "../utils/localStorage";
import { translate } from "../utils/language";

const Login = () => {
  //Navigation
  const navigate = useNavigate();
  //Toast
  const toast = useRef(null);

  //States
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState("");

  //UseEffect
  useEffect(() => {
    const token = getToken();
    if (token) {
      tokenLogin(token).then((res) => {
        if (res.data.type === "error") {
          removeToken();
          return;
        }
        navigate("/post/tracking");
      });
    }
  }, []);

  //Handlers
  const handleLogin = () => {
    login(username, password).then((res) => {
      if (res.data.type === "error") {
        displayPopup(toast, "error", translate(res.data.data), "");
        return;
      }
      saveToken(res.data.data.loginToken);
      navigate("/post/tracking");
    });
  };

  return (
    <div>
      <div className="col-12 text-end">
        <Button
          className="p-button-text p-button-sm mx-5"
          label={translate("REGISTER")}
          onClick={() => navigate("/post/register")}
        />
        <Language onLanguageChange={setLanguage} />
      </div>
      <Toast ref={toast} />
      <div className="row justify-content-center mb-4">
        <div className="col-8">
          <h1 className="text-light text-center">{translate("LOGIN")}</h1>
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
              label={translate("LOGIN")}
              icon="pi pi-user"
              iconPos="right"
              onClick={handleLogin}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
