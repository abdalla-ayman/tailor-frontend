// src/contexts/UserContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { getUser } from "../api/users.api";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User is null if not logged in

  const _getUser = async () => {
    const token = localStorage.getItem("auth");
    if (token) {
      const user = await getUser();
      setUser(user);
    }
  };

  useEffect(() => {
    _getUser();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth");
  };

  return (
    <UserContext.Provider value={{ user, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
