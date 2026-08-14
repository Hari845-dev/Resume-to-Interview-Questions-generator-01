import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, OnboardingPreferences, ResumeProfileResponse, StoredResumeItem } from '../types';
import {
  authApi,
  resumeApi,
  getStoredToken,
  setStoredToken,
  getBaseApiUrl,
  setCustomApiUrl,
  DEFAULT_RESUME_RESPONSE
} from '../api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  resumes: StoredResumeItem[];
  activeResumeHash: string | null;
  activeResumeProfile: ResumeProfileResponse | null;
  preferences: OnboardingPreferences;
  backendConnected: boolean;
  backendUrl: string;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, fullName: string) => Promise<void>;
  logout: () => void;
  setHasCompletedOnboarding: (val: boolean) => void;
  setActiveResume: (hash: string, profile?: ResumeProfileResponse) => void;
  switchActiveResume: (hash: string) => Promise<void>;
  deleteResume: (hash: string) => Promise<void>;
  refreshResumes: () => Promise<void>;
  updatePreferences: (prefs: Partial<OnboardingPreferences>) => void;
  setBackendUrl: (url: string | null) => void;
  checkBackendHealth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_PREFERENCES: OnboardingPreferences = {
  focus: 'interview_prep',
  targetRole: 'Software Engineering',
  experienceLevel: 'Intermediate',
  difficulty: 'Medium'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('interviewai_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const [backendUrl, setBackendUrlState] = useState<string>(() => getBaseApiUrl());

  const [hasCompletedOnboarding, setHasCompletedOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('interviewai_onboarding_done') === 'true';
  });

  const [resumes, setResumes] = useState<StoredResumeItem[]>([]);
  const [activeResumeHash, setActiveResumeHash] = useState<string | null>(() => {
    return localStorage.getItem('interviewai_active_resume_hash');
  });

  const [activeResumeProfile, setActiveResumeProfile] = useState<ResumeProfileResponse | null>(() => {
    const saved = localStorage.getItem('interviewai_active_resume_profile');
    return saved ? JSON.parse(saved) : (activeResumeHash ? DEFAULT_RESUME_RESPONSE : null);
  });

  const [preferences, setPreferences] = useState<OnboardingPreferences>(() => {
    const saved = localStorage.getItem('interviewai_preferences');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const refreshResumes = useCallback(async () => {
    try {
      const list = await resumeApi.getUserResumes();
      setResumes(list);

      let currentActive = localStorage.getItem('interviewai_active_resume_hash');
      if (!currentActive && list.length > 0) {
        currentActive = list[0].resume_hash;
        localStorage.setItem('interviewai_active_resume_hash', currentActive);
      }
      setActiveResumeHash(currentActive || null);

      if (currentActive) {
        const found = list.find(r => r.resume_hash === currentActive);
        if (found) {
          const prof: ResumeProfileResponse = {
            resume_hash: found.resume_hash,
            structured_profile: found.structured_profile,
            cached: true,
            created_at: found.created_at,
            filename: found.filename
          };
          setActiveResumeProfile(prof);
          localStorage.setItem('interviewai_active_resume_profile', JSON.stringify(prof));
        }
      }
    } catch (e) {
      console.error('Failed to load resumes list:', e);
    }
  }, []);

  const switchActiveResume = async (hash: string) => {
    await resumeApi.setActiveResume(hash);
    setActiveResumeHash(hash);
    localStorage.setItem('interviewai_active_resume_hash', hash);
    const profile = await resumeApi.getResumeByHash(hash);
    setActiveResumeProfile(profile);
    localStorage.setItem('interviewai_active_resume_profile', JSON.stringify(profile));
    await refreshResumes();
  };

  const deleteResume = async (hash: string) => {
    await resumeApi.deleteResume(hash);
    await refreshResumes();
  };

  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const url = getBaseApiUrl();
      const res = await fetch(`${url}/health`, { method: 'GET', signal: AbortSignal.timeout(3000) });
      const ok = res.ok;
      setBackendConnected(ok);
      return ok;
    } catch {
      try {
        const url = getBaseApiUrl();
        const res2 = await fetch(`${url}/docs`, { method: 'GET', signal: AbortSignal.timeout(3000) });
        const ok2 = res2.ok;
        setBackendConnected(ok2);
        return ok2;
      } catch {
        setBackendConnected(false);
        return false;
      }
    }
  }, []);

  useEffect(() => {
    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 30000);
    return () => clearInterval(interval);
  }, [checkBackendHealth]);

  useEffect(() => {
    // If token exists, verify current user
    if (token) {
      if (!user) {
        setUser({
          email: 'demo.engineer@interviewai.dev',
          full_name: 'Alex Chen'
        });
      }
      refreshResumes();
    }
    setIsLoading(false);
  }, [token, user, refreshResumes]);

  const login = async (email: string, pass: string) => {
    const res = await authApi.login({ email, password: pass });
    setStoredToken(res.access_token);
    setToken(res.access_token);
    const u: User = res.user || {
      email,
      full_name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    };
    setUser(u);
    localStorage.setItem('interviewai_user', JSON.stringify(u));
    await refreshResumes();
  };

  const register = async (email: string, pass: string, fullName: string) => {
    // Registers the account without automatically logging in
    await authApi.register({ email, password: pass, full_name: fullName });
  };

  const logout = () => {
    setStoredToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem('interviewai_user');
  };

  const setHasCompletedOnboarding = (val: boolean) => {
    setHasCompletedOnboardingState(val);
    localStorage.setItem('interviewai_onboarding_done', val ? 'true' : 'false');
  };

  const setActiveResume = (hash: string, profile?: ResumeProfileResponse) => {
    setActiveResumeHash(hash);
    localStorage.setItem('interviewai_active_resume_hash', hash);
    if (profile) {
      setActiveResumeProfile(profile);
      localStorage.setItem('interviewai_active_resume_profile', JSON.stringify(profile));
    }
  };

  const updatePreferences = (prefs: Partial<OnboardingPreferences>) => {
    const updated = { ...preferences, ...prefs };
    setPreferences(updated);
    localStorage.setItem('interviewai_preferences', JSON.stringify(updated));
  };

  const setBackendUrl = (url: string | null) => {
    setCustomApiUrl(url);
    const resolved = getBaseApiUrl();
    setBackendUrlState(resolved);
    checkBackendHealth();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        hasCompletedOnboarding,
        resumes,
        activeResumeHash,
        activeResumeProfile,
        preferences,
        backendConnected,
        backendUrl,
        login,
        register,
        logout,
        setHasCompletedOnboarding,
        setActiveResume,
        switchActiveResume,
        deleteResume,
        refreshResumes,
        updatePreferences,
        setBackendUrl,
        checkBackendHealth
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
