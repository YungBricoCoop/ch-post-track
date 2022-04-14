const saveToken = (token) => {
  localStorage.setItem("loginToken", token);
};

const getToken = () => {
  return localStorage.getItem("loginToken");
};

const removeToken = () => {
  localStorage.removeItem("loginToken");
};

export { saveToken, getToken, removeToken};
