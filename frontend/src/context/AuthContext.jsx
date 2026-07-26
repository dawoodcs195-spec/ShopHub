import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const normalizeUser = (u) => {
  if (!u) return null;
  // Ensure both id and _id exist for compatibility across the app
  return {
    ...u,
    _id: u._id || u.id,
    id: u.id || u._id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      return normalizeUser(parsed);
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }

    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [user, token]);

  const login = (userData, jwtToken) => {
    setUser(normalizeUser(userData));
    setToken(jwtToken || null);
  };

  const updateUser = (userData) => {
    setUser(normalizeUser(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);