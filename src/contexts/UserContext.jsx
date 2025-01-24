import { createContext, useState, useContext, useEffect, useCallback } from "react";
import { getUser } from "../api/users.api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("auth");
  }, []);

  const _getUser = useCallback(async () => {
    const token = localStorage.getItem("auth");
    if (token) {
      try {
        const user = await getUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        logout();
      }
    }
    setLoading(false);
  }, [logout, refreshTrigger]);

  useEffect(() => {
    _getUser();
  }, [_getUser]);

  return (
    <UserContext.Provider value={{ user, logout, loading, setRefreshTrigger }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};