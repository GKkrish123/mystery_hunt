"use client";

import { auth } from "firebase";
import { onAuthStateChanged, User } from "firebase/auth"
import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import AppLoader from "./ui/appLoader";
import { useRouter } from "next/navigation";

type AuthContextType = {
    user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export function AuthProvider({ children }: { children: ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    useEffect(() => {        
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setLoading(true);
            // if (!user) {
            //     location.pathname !== "/login" && router.push("/login");
            // } else {
            //     location.pathname === "/login" && router.replace("/");
            // }
            setUser(user || null);
            setTimeout(() => {
                setLoading(false);
            }, 500);
        }, (error) => {
            console.error("Error in getting authentication state", error);
        });
        
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <AppLoader />
    }

    return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext);
