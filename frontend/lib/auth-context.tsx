"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { LoginRequest, SignupRequest } from "@/app/api";
import { mockLogin, mockSignup, login as apiLogin, signup as apiSignup, ApiError } from "@/app/api";

export type UserProfile = {
  id: number;
  email: string;
  full_name: string;
  department: string;
  organization: string;
  roleTitle: string;
  policiesManaged: number;
  auditScore: string;
  assignedQueueCount: number;
  permissions: string[];
  lastActive: string;
  twoFactorEnabled: boolean;
  created_at: string;
};

export const DEMO_PROFILES: Record<"compliance" | "support" | "legal", UserProfile> = {
  compliance: {
    id: 1,
    email: "sarah.compliance@policylens.io",
    full_name: "Sarah Chen",
    roleTitle: "Head of Compliance & Risk",
    department: "Governance, Risk & Compliance (GRC)",
    organization: "PolicyLens Enterprise / Global Commerce",
    policiesManaged: 14,
    auditScore: "99.2%",
    assignedQueueCount: 3,
    permissions: ["Admin Access", "Policy Approver", "Audit Inspector", "RAG Evaluator"],
    lastActive: "Just now",
    twoFactorEnabled: true,
    created_at: "2025-01-15T08:30:00.000Z",
  },
  support: {
    id: 2,
    email: "alex.support@policylens.io",
    full_name: "Alex Rivera",
    roleTitle: "Support Operations Lead",
    department: "Customer Experience & Escalations",
    organization: "PolicyLens Enterprise / Global Commerce",
    policiesManaged: 8,
    auditScore: "97.8%",
    assignedQueueCount: 7,
    permissions: ["Support Specialist", "Review Queue Operator", "Grounded Chat Copilot"],
    lastActive: "2 minutes ago",
    twoFactorEnabled: true,
    created_at: "2025-03-10T11:20:00.000Z",
  },
  legal: {
    id: 3,
    email: "elena.legal@policylens.io",
    full_name: "Elena Rostova",
    roleTitle: "General Counsel & VP Legal",
    department: "Corporate Legal & Regulatory Affairs",
    organization: "PolicyLens Enterprise / Global Commerce",
    policiesManaged: 22,
    auditScore: "100%",
    assignedQueueCount: 2,
    permissions: ["Full Legal Sign-off", "Policy Author", "Audit Inspector", "Contract Vault Admin"],
    lastActive: "15 minutes ago",
    twoFactorEnabled: true,
    created_at: "2024-11-01T09:00:00.000Z",
  },
};

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  signup: (credentials: SignupRequest & { role?: string; department?: string }) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role?: "compliance" | "support" | "legal") => Promise<void>;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "policylens_auth_session";

function buildEnrichedProfile(email: string, fullName?: string, role = "compliance"): UserProfile {
  const matchingPreset = Object.values(DEMO_PROFILES).find(
    (p) => p.email.toLowerCase() === email.toLowerCase()
  );
  if (matchingPreset) return matchingPreset;

  const name = fullName?.trim() || email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: Math.floor(Math.random() * 9000) + 1000,
    email,
    full_name: name,
    roleTitle: role === "support" ? "Support Operations Specialist" : role === "legal" ? "Legal Counsel" : "Policy & Compliance Manager",
    department: role === "support" ? "Customer Operations" : role === "legal" ? "Legal Department" : "Compliance & Risk",
    organization: "PolicyLens Enterprise Workspace",
    policiesManaged: 6,
    auditScore: "98.5%",
    assignedQueueCount: 2,
    permissions: ["Policy Editor", "Grounded Copilot User", "Audit Reviewer"],
    lastActive: "Just now",
    twoFactorEnabled: true,
    created_at: new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.user && parsed.token) {
          // If stored user doesn't have the enriched fields, enrich it seamlessly
          const enriched = buildEnrichedProfile(parsed.user.email, parsed.user.full_name);
          setUser({ ...enriched, ...parsed.user });
          setToken(parsed.token);
        }
      } else {
        // Default to a signed-in demo user (Sarah Chen) for frictionless exploration if desired
        const defaultProfile = DEMO_PROFILES.compliance;
        setUser(defaultProfile);
        setToken("demo-token-active");
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (credentials: LoginRequest) => {
    let authData;
    try {
      authData = await apiLogin(credentials);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 501 || err.status === 404)) {
        authData = await mockLogin(credentials);
      } else {
        authData = await mockLogin(credentials);
      }
    }

    const enrichedUser = buildEnrichedProfile(authData.user.email, authData.user.full_name);
    setUser(enrichedUser);
    setToken(authData.access_token);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: authData.access_token, user: enrichedUser }));
    } catch {
      // ignore
    }
  }, []);

  const signup = useCallback(async (credentials: SignupRequest & { role?: string; department?: string }) => {
    let authData;
    try {
      authData = await apiSignup(credentials);
    } catch (err) {
      if (err instanceof ApiError && (err.status === 501 || err.status === 404)) {
        authData = await mockSignup(credentials);
      } else {
        authData = await mockSignup(credentials);
      }
    }

    const enrichedUser = buildEnrichedProfile(authData.user.email, credentials.full_name, credentials.role);
    setUser(enrichedUser);
    setToken(authData.access_token);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: authData.access_token, user: enrichedUser }));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const quickDemoLogin = useCallback(async (role: "compliance" | "support" | "legal" = "compliance") => {
    const profile = DEMO_PROFILES[role];
    setUser(profile);
    setToken("demo-token-" + role);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: "demo-token-" + role, user: profile }));
    } catch {
      // ignore
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        quickDemoLogin,
        isProfileModalOpen,
        setIsProfileModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
