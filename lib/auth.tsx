"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { ApiError, getMe, login as loginRequest, register as registerRequest } from "./api";
import type { User } from "./types";

const KEY = "dukkan:token";

type Auth = {
  user: User | null;
  token: string | null;
  ready: boolean; // false حتى نتحقق من الجلسة المحفوظة
  login: (username: string, password: string) => Promise<void>;
  register: (data: Parameters<typeof registerRequest>[0]) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<Auth | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const logout = () => {
    localStorage.removeItem(KEY);
    setToken(null);
    setUser(null);
  };

  // عند فتح الموقع: إن كان هناك token محفوظ، نسأل الـ API عن صاحبه
  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (!saved) {
      setReady(true);
      return;
    }
    getMe(saved)
      .then((me) => {
        setToken(saved);
        setUser(me);
      })
      .catch((error) => {
        // 401: انتهت صلاحية الـ token، فنخرج المستخدم
        if (error instanceof ApiError && error.status === 401) localStorage.removeItem(KEY);
      })
      .finally(() => setReady(true));
  }, []);

  // الدخول وإنشاء الحساب يرجعان الشكل نفسه: بيانات المستخدم ومعها الرمز
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const start = ({ accessToken, refreshToken, ...me }: Awaited<ReturnType<typeof loginRequest>>) => {
    localStorage.setItem(KEY, accessToken);
    setToken(accessToken);
    setUser(me);
  };
  const login = async (username: string, password: string) => start(await loginRequest(username, password));
  const register = async (data: Parameters<typeof registerRequest>[0]) => start(await registerRequest(data));

  return (
    <AuthContext.Provider value={{ user, token, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const auth = useContext(AuthContext);
  if (!auth) throw new Error("useAuth يجب أن يُستعمل داخل AuthProvider");
  return auth;
}
