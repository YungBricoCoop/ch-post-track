import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "primeicons/primeicons.css";
import "primereact/resources/themes/lara-dark-purple/theme.css";
import "primereact/resources/primereact.css";

import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

import { register } from "../api/userAPI";
import displayPopup from "../utils/popup";

const Register = () => {
  const navigate = useNavigate();
  const toast = useRef(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    register(username, password).then((res) => {
      if (res.data.type === "error") {
        displayPopup(toast, "error", "Register", res.data.data);
        return;
      }
      navigate("/post/login");
    });
  };


  return (
    <div>
      <div className="col-12 text-end">
        <Button
          className="p-button-outlined p-button-rounded p-button-sm"
          label="Login"
          onClick={()=>navigate("/post/login")}
        />
      </div>
      <Toast ref={toast} />
      <div className="row justify-content-center mb-4">
        <div className="col-8">
          <h1 className="text-light text-center">Register</h1>
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
              <label htmlFor="username">Username</label>
            </span>
            <span className="p-float-label mb-4">
              <InputText
                className="w-100"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="password">Password</label>
            </span>
            <Button
              className="w-100 mb-2"
              label="Register"
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
