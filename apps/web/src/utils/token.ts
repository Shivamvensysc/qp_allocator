import Cookies from "js-cookie";

//save toke 
export const saveToken = (token: string) => {
  localStorage.setItem("token", token);

  Cookies.set("token", token, {
    expires: 1,
    path: "/",
  });
};

//clear token 
export const clearToken = () => {
  localStorage.removeItem("token");

  Cookies.remove("token", {
    path: "/",
  });
};

//get token  
export const getToken = () => {
  return Cookies.get("token");
};