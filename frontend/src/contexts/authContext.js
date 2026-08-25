"use client";

import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { authApi } from "@/lib/apiService";
import { usePathname, useRouter } from "next/navigation";
import { logout as LogoutExt } from "../app/auth/logout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthContext = createContext();

// DEMO MODE: auto-login user demo & skip halaman login
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

export function AuthProvider ({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [error, setError] = useState('')
  const [token, setToken] = useState(null);
  const [idUser, setUserId] = useState(0);
  const [loading, setLoading] = useState(false);
  const [statusPath, setStatusPath] = useState(null);
  const [user, setUser] = useState(null);

  const protectedRoutes = [
    "/", "/camera/manager", "/camera"
  ];

  function parseJwt (token) {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) throw new Error("Token format is invalid");

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

      const jsonPayload = atob(base64);
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT:", e);
      return null;
    }
  }

  function isTokenExpired (token) {
    const decoded = parseJwt(token);
    if (!decoded || !decoded.exp) return true;

    const now = Date.now() / 1000;
    return decoded.exp < now;
  }

  // Fungsi untuk validasi token
  function validateToken (token) {
    if (!token || typeof token !== "string") return false;

    // Jika token adalah mock token, anggap valid
    if (token === "mocked.jwt.token") return true;

    // Untuk JWT token real, cek format dan expiry
    if (token.includes(".")) {
      return !isTokenExpired(token);
    }

    return false;
  }

  useEffect(() => {
    const checkToken = async () => {
      // DEMO MODE: langsung set user demo tanpa perlu login
      if (DEMO_MODE) {
        const demoToken = "mocked.jwt.token";
        const demoUser = { username: "Demo User", roles: [{ name: "admin" }] };
        if (!Cookies.get("token")) {
          Cookies.set("token", demoToken, { expires: 0.5, path: "/" });
          Cookies.set("user", JSON.stringify(demoUser), { expires: 0.5, path: "/" });
        }
        setToken(demoToken);
        setUser(demoUser);
        setLoading(true);
        if (pathname === "/auth/login") {
          router.push("/");
        }
        return;
      }

      const storedToken = Cookies.get("token");
      const userId = Cookies.get("id_user") || null;

      setUserId(userId);

      if (storedToken && validateToken(storedToken)) {
        setToken(storedToken);
        if (pathname === "/auth/login") {
          router.push("/");
        }
      } else {
        // Token tidak valid atau tidak ada
        if (storedToken) {
          // Jika ada token tapi tidak valid, hapus
          LogoutExt();
        }
        setToken(null);
        if (protectedRoutes.includes(pathname)) {
          router.push("/auth/login");
        }
      }

      const storedUser = Cookies.get("user");

      try {
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;

        if (parsedUser && typeof parsedUser === "object") {
          setUser(parsedUser);
        } else {
          console.warn("Invalid user cookie data.");
          Cookies.remove("user"); // optional cleanup
          setUser(null);
        }
      } catch (e) {
        console.error("Failed to parse user cookie:", e);
        Cookies.remove("user"); // optional cleanup
        setUser(null);
      }

      await new Promise((resolve) => setTimeout(resolve, 0));
      setLoading(true);
    };

    checkToken();
  }, [pathname]);


  // Handle routing error ke /not-found
  const isNotFound = pathname === "/not-found";
  useEffect(() => {
    if (statusPath === "/not-found") {
      router.push("/not-found");
    }
  }, [statusPath]);


  // const login = async (credentials) => {
  //   try {
  //     const res = await authApi.login(credentials);
  //     // biasanya response FastAPI OAuth2 return { access_token, token_type }
  //     const newToken = res.data?.access_token;

  //     if (!newToken) {
  //       throw new Error("Token tidak ditemukan di response login");
  //     }

  //     if (validateToken(newToken)) {
  //       Cookies.set("token", newToken, { expires: 0.5, path: "/" });
  //       setToken(newToken);

  //       // Kalau backend juga balikin user → simpan
  //       let userData = res.data?.user || null;

  //       if (!userData && newToken.includes(".")) {
  //         // fallback extract dari JWT
  //         try {
  //           const decoded = parseJwt(newToken);
  //           if (decoded) {
  //             userData = {
  //               id: decoded.id || decoded.sub,
  //               username: decoded.sub,
  //               roles: decoded.roles || []
  //             };
  //           }
  //         } catch (error) {
  //           console.error("Error parsing JWT token:", error);
  //         }
  //       }

  //       if (userData) {
  //         Cookies.set("user", JSON.stringify(userData), { expires: 0.5, path: "/" });
  //         Cookies.set("id_user", userData.id || userData.sub, { expires: 0.5, path: "/" });
  //         setUser(userData);
  //         setUserId(userData.id || userData.sub);
  //       }

  //       router.push("/"); // redirect setelah login sukses
  //     } else {
  //       toast.error("Token tidak valid dari server", { position: 'top-right' });
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err);
  //     toast.error(err.response?.data?.detail || "Login gagal", { position: 'top-right' });
  //   }
  // };
  
  const login = (newToken, user = null) => {
    if (validateToken(newToken)) {
      Cookies.set("token", newToken, { expires: 0.5, path: "/" });

      // Jika user tidak disediakan, coba ekstrak dari token JWT
      if (!user && newToken.includes(".")) {
        try {
          const decoded = parseJwt(newToken);
          if (decoded) {
            user = {
              id: decoded.id || decoded.sub,
              username: decoded.sub,
              roles: decoded.roles || []
            };
          }
        } catch (error) {
          console.error("Error parsing JWT token:", error);
        }
      }

      if (user) {
        Cookies.set("user", JSON.stringify(user), { expires: 0.5, path: "/" });
        Cookies.set("id_user", user.id || user.sub, { expires: 0.5, path: "/" });
        setUser(user);
        setUserId(user.id || user.sub);
      }

      setToken(newToken);
      // Redirect akan ditangani oleh useEffect di atas
    } else {
      toast.error("Invalid token provided to login function", { position: 'top-right' });
      // Bisa tambahkan error handling disini
    }
  };

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("id_user");
    setToken(null);
    setUserId(0);
    router.push("/auth/login");
  };

  const userRoles = user?.roles?.map(item => item?.name?.toLowerCase() ?? '') || [];
  const isAdmin = userRoles.includes('admin');
  const isEditor = userRoles.some(role => ['admin', 'operator'].includes(role));

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        login,
        logout,
        pathname,
        isNotFound,
        setStatusPath,
        statusPath,
        loading,
        setLoading,
        setUserId,
        idUser,
        validateToken, // Export fungsi validasi jika dibutuhkan
        error,
        setError,
        userRoles,
        isAdmin,
        isEditor
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth () {
  return useContext(AuthContext);
}