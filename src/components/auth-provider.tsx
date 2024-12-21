"use client";

import { auth } from "firebase-user";
import { onAuthStateChanged, onIdTokenChanged, type User } from "firebase/auth";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLoader from "./ui/app-loader";
import { useRouter } from "next/navigation";
import { getCookie, setCookie } from "cookies-next";

type AuthContextType = {
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scheduleLogout = (timeUntilExpiryMs: number, user: User | null) => {
    logoutTimeoutRef.current = setTimeout(() => {
      void (async () => {
        if (
          document.visibilityState === "visible" &&
          !document.hidden &&
          user
        ) {
          await updateToken(user);
        } else {
          await auth.signOut();
        }
      })();
    }, timeUntilExpiryMs);
  };

  // const handleVisibilityChange = () => {
  //     if (!document.hidden) {
  //         getTokenExpiry();
  //     }
  // };

  const updateToken = async (user: User | null) => {
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
    // document.removeEventListener(
    //     "visibilitychange",
    //     handleVisibilityChange
    // );
    const token = await getCookie("token");
    const tokenBoom = await getCookie("token-boom");
    if (user && token && tokenBoom && Date.now() < parseInt(tokenBoom, 10)) {
      const token = await user.getIdTokenResult();
      const expirationTime = new Date(token.expirationTime).getTime();
      await setCookie("token", token.token);
      await setCookie("token-boom", expirationTime);
      const timeUntilExpiryMs = expirationTime - Date.now() - 60 * 1000; // 1 minute before expiry
      scheduleLogout(timeUntilExpiryMs, user);
      // document.addEventListener("visibilitychange", handleVisibilityChange);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        void (async () => {
          setLoading(true);
          if (!user) {
            if (location.pathname !== "/login") {
              router.push("/login");
            }
          } else if (!user.emailVerified || !user.displayName) {
            if (location.pathname !== "/verify") {
              router.push("/verify");
            }
          } else {
            if (location.pathname === "/login") {
              router.replace("/verify");
            }
          }
          // await updateToken(user);
          setUser(user ?? null);
          setTimeout(() => {
            setLoading(false);
          }, 500);
        })();
      },
      (error) => {
        console.error("Error in getting authentication state", error);
      },
    );

    const tokenSubscription = onIdTokenChanged(auth, (user) => {
      void (async () => {
        await updateToken(user);
      })();
    });

    return () => {
      unsubscribe();
      tokenSubscription();
      // document.removeEventListener(
      //     "visibilitychange",
      //     handleVisibilityChange
      // );
      if (logoutTimeoutRef.current) {
        clearTimeout(logoutTimeoutRef.current);
        logoutTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <AppLoader />;
  }

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
