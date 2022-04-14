import axios from "axios";
import * as qs from "qs";

import { URLS } from "../config/api";

const register = (username, password) => {
  return axios.post(
    URLS.USER,
    qs.stringify({ action: "register", username, password }),
    { withCredentials: true }
  );
};

const login = (username, password) => {
  return axios.post(
    URLS.USER,
    qs.stringify({ action: "login", username, password }),
    { withCredentials: true }
  );
};

const tokenLogin = (token) => {
  return axios.post(URLS.USER, qs.stringify({ action: "tokenLogin", token }), {
    withCredentials: true,
  });
};


const logout = () => {
    return axios.post(URLS.USER, qs.stringify({ action: "logout" }), {
        withCredentials: true,
    });
}

export { login, tokenLogin, register, logout};
