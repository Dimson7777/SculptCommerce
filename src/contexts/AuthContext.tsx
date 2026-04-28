import React, { createContext, useContext, useEffect, useState, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Set up listener FIRST (before getSession)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mountedRef.current) return;
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (!currentUser) {
          setIsAdmin(false);
        }
        setLoading(false);

        // Fire-and-forget admin check — no await in callback
        if (currentUser) {
          supabase.rpc("has_role", { _user_id: currentUser.id, _role: "admin" as const })
            .then(({ data }) => {
              if (mountedRef.current) setIsAdmin(!!data);
            });
        }
      }
    );

    // Then restore session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return;
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        supabase.rpc("has_role", { _user_id: currentUser.id, _role: "admin" as const })
          .then(({ data }) => {
            if (mountedRef.current) setIsAdmin(!!data);
          });
      }
      setLoading(false);
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
