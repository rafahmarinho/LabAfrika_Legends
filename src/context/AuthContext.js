import React, { useEffect, useState, createContext } from "react";
import { useRouter } from "next/router";
import Cokkies from "js-cookie";
import { useToast } from "@chakra-ui/react";
import axios from "axios";

const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const login = async ({ name, password }) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/auth/login", { name, password });
      if (response?.data?.twoFactorAuth) {
        return response.data;
      }
      setCurrentUser(response.data.user);
      Cokkies.set("token", response.data.token, { expires: 1 });
      router.push("/my-account");
      toast({
        title: "Login efetuado com sucesso!",
        status: "success",
        duration: 9000,
        position: "bottom",
        isClosable: true,
      });
      setLoading(false);
    } catch (err) {
      toast({
        title: err?.response?.data.split(":")[1].trim(),
        status: "error",
        position: "bottom",
        duration: 9000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  const logout = () => {
    Cokkies.remove("token");
    router.push("/login");
    setCurrentUser(null);
  };

  useEffect(() => {
    if (Cokkies.get("token")) {
      axios
        .put("/api/auth/login", { tokenNumber: Cokkies.get("token") })
        .then((res) => {
          setCurrentUser(res.data.user);
          Cokkies.set("token", res.data.token, { expires: 1 });
        })
        .catch(() => {
          setCurrentUser(null);
        });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ setCurrentUser, currentUser, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
