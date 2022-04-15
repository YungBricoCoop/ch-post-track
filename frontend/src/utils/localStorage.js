const saveToken = (token) => {
  localStorage.setItem("loginToken", token);
};

const getToken = () => {
  return localStorage.getItem("loginToken");
};

const removeToken = () => {
  localStorage.removeItem("loginToken");
};

const saveLanguage = (language) => {
  localStorage.setItem("language", language);
}

const getLanguage = () => {
  return localStorage.getItem("language");
}

export { saveToken, getToken, removeToken , saveLanguage, getLanguage};
