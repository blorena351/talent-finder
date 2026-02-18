/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

// Types
export interface User {
  id: string;
  name: string; // Display name (from profile)
  role: 'company' | 'applicant' | 'admin';
  email: string;
  passwordHash?: string; // Mock hash
  status: 'active' | 'suspended';
  emailVerified: boolean;
  onboardingComplete: boolean;
  isDemo?: boolean; // Flag for demo accounts
  createdAt: string;
  updatedAt: string;
}

export interface CompanyProfile {
  userId: string;
  companyName: string;
  website: string;
  size: string; // '1-10', '11-50', etc.
  industry: string;
  country: string;
  contactPerson: string;
  contactPhone: string;
  description?: string;
  logoUrl?: string;
}

export interface ApplicantProfile {
  userId: string;
  fullName: string;
  country: string;
  phone?: string;
  linkedInUrl?: string;
  executionAreas?: string[];
  preferredWorkTypes?: ('Remote' | 'Hybrid' | 'On-site')[];
  preferredGeographies?: string[];
  preferredContractTypes?: ('Full-time' | 'Part-time' | 'Contract' | 'Freelance')[];
  seniority?: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  salaryExpectationMin?: number;
  salaryExpectationMax?: number;
  availability?: 'Immediate' | '2 Weeks' | '1 Month' | '2+ Months';
  languages?: string[];
}

export interface Job {
  id: string;
  companyId: string;
  title: string;
  description: string;
  requirements: string;
  skills: string[];
  executionAreas?: string[];
  workType?: 'Remote' | 'Hybrid' | 'On-site';
  geography?: string;
  contractType?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
  seniority?: 'Junior' | 'Mid' | 'Senior' | 'Lead';
  salaryMin?: number;
  salaryMax?: number;
  requiredLanguages?: string[];
  mustHaveSkills?: string[];
  niceToHaveSkills?: string[];
  interviewStyle: 'Technical' | 'Behavioral' | 'Mixed' | 'Casual';
  createdAt: string;
}

export interface JobAISettings {
  id: string;
  jobId: string;
  tone: 'Professional' | 'Friendly' | 'Neutral' | 'Energetic' | 'Calm';
  priorityQuestions: string[];
  autoFollowUp: boolean;
  scoringWeights: {
    transcript: number;
    video: number;
  };
  updatedAt: string;
}

export interface AIResume {
  summary: string;
  skills: string[];
  strengths: string[];
  suggestedRole: string;
  formattedResume: string; // Markdown formatted resume
}

export interface Application {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  executionLevel?: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'reviewed';
  matchScore: number;
  aiResume?: AIResume;
  transcripts?: { question: string; answer: string }[];
  videoAnalyses?: { question: string; summary: string; confidence: number }[];
  transcriptMatchScore?: number;
  videoMatchScore?: number;
  scoringWeights?: { transcript: number; video: number };
  timestamp: string;
}

export interface SystemSettings {
    allowNewRegistrations: boolean;
    maintenanceMode: boolean;
    interviewDuration: number;
}

export interface AIPrompts {
    questionGeneration: string;
    profileGeneration: string;
}

export interface AnalyticsData {
    totalUsers: number;
    totalInterviews: number;
    totalJobs: number;
    apiCost: number;
    revenue: number;
}

// AI Agent Settings Interface
export interface CompanyAISettings {
    id: string;
    companyId: string;
    agentName: string;
    tone: 'Professional' | 'Friendly' | 'Neutral' | 'Energetic' | 'Calm';
    style: 'Structured' | 'Conversational' | 'Behavioral' | 'Technical' | 'Creative';
    sliders: {
        formality: number; // 0-100
        strictness: number;
        pacing: number;
        detail: number;
    };
    customQuestions: {
        id: string;
        text: string;
        category: 'Technical' | 'Soft Skills' | 'Behavioral' | 'Background' | 'Culture';
        difficulty: number; // 1-5
        weight: number; // 1-10
    }[];
    autoFollowUp: boolean;
    trainingData: {
        mission: string;
        roles: string;
        stack: string;
        redFlags: string;
        idealProfile: string;
    };
    voice: {
        voiceId: string;
        pitch: number;
        speed: number;
        intonation: number;
        enabled: boolean;
    };
    flow: {
        maxLength: number;
        maxQuestions: number;
        decisionTree: 'Linear' | 'Dynamic';
        criteriaWeights: {
            personality: number;
            communication: number;
            technical: number;
            cultural: number;
            problemSolving: number;
        };
    };
    updatedAt: string;
}

// In-memory storage
export const videoStorage = new Map<string, Record<number, Blob>>();
// Mock verification codes: email -> code
const verificationCodes = new Map<string, string>();
const DEMO_MODE_ENABLED = import.meta.env.VITE_ENABLE_DEMO === 'true';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const ADMIN_TOKEN_KEY = 'talent_finder_admin_token';

// Helpers
const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
const hashPassword = (pwd: string) => `$$hash_${pwd.split('').reverse().join('')}`; // Mock hashing
const postJSON = async <T>(path: string, payload: unknown, token?: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({} as any));
    throw new Error(body?.message || body?.error || `Request failed (${response.status})`);
  }
  return response.json();
};

const patchJSON = async <T>(path: string, payload: unknown, token?: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({} as any));
    throw new Error(body?.message || body?.error || `Request failed (${response.status})`);
  }
  return response.json();
};

const putJSON = async <T>(path: string, payload: unknown, token?: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({} as any));
    throw new Error(body?.message || body?.error || `Request failed (${response.status})`);
  }
  return response.json();
};

const getJSON = async <T>(path: string, token?: string): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'GET',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({} as any));
    throw new Error(body?.message || body?.error || `Request failed (${response.status})`);
  }
  return response.json();
};

// Mock Database methods
export const Store = {
  // Users
  getUsers: (): User[] => {
    return JSON.parse(localStorage.getItem('talent_finder_users') || '[]');
  },

  // Auth: Register Step 1
  register: async (email: string, password: string, role: 'company' | 'applicant'): Promise<{ success: boolean; message?: string; emailVerificationRequired?: boolean }> => {
    try {
      const result = await postJSON<{ success: boolean; message?: string; debugVerificationCode?: string; user?: User; emailVerificationRequired?: boolean }>(
        '/api/auth/register',
        { email, password, role }
      );
      if (result.success && result.user) {
        const users = Store.getUsers();
        const idx = users.findIndex(u => u.email === result.user!.email);
        if (idx === -1) {
          users.push(result.user);
        } else {
          users[idx] = { ...users[idx], ...result.user };
        }
        localStorage.setItem('talent_finder_users', JSON.stringify(users));
        localStorage.setItem('talent_finder_current_user', JSON.stringify(result.user));
      }
      if (result.debugVerificationCode && DEMO_MODE_ENABLED) {
        alert(`[DEMO] Your verification code is: ${result.debugVerificationCode}`);
      }
      return { success: result.success, message: result.message, emailVerificationRequired: result.emailVerificationRequired };
    } catch (error) {
      await delay(800);
      const users = Store.getUsers();
      if (users.find(u => u.email === email)) {
        return { success: false, message: "Email already registered." };
      }

      const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name: email.split('@')[0], // Temporary name
          role,
          passwordHash: hashPassword(password),
          status: 'active',
          emailVerified: true,
          onboardingComplete: false,
          isDemo: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('talent_finder_users', JSON.stringify(users));
      localStorage.setItem('talent_finder_current_user', JSON.stringify(newUser));

      console.warn('Remote register failed, fallback to local mode.', error);
      return { success: true, emailVerificationRequired: false };
    }
  },

  // Auth: Verify Email
  verifyEmail: async (email: string, code: string): Promise<boolean> => {
      try {
          const result = await postJSON<{ success: boolean; user?: User }>('/api/auth/verify', { email, code });
          if (result.success && result.user) {
              const users = Store.getUsers();
              const userIndex = users.findIndex(u => u.email === result.user!.email);
              if (userIndex === -1) {
                  users.push(result.user);
              } else {
                  users[userIndex] = { ...users[userIndex], ...result.user };
              }
              localStorage.setItem('talent_finder_users', JSON.stringify(users));
              localStorage.setItem('talent_finder_current_user', JSON.stringify(result.user));
              return true;
          }
          return false;
      } catch (error) {
          await delay(600);
          const storedCode = verificationCodes.get(email);
          if (storedCode === code) {
              const users = Store.getUsers();
              const userIndex = users.findIndex(u => u.email === email);
              if (userIndex !== -1) {
                  users[userIndex].emailVerified = true;
                  localStorage.setItem('talent_finder_users', JSON.stringify(users));
                  localStorage.setItem('talent_finder_current_user', JSON.stringify(users[userIndex]));
                  return true;
              }
          }
          console.warn('Remote verify failed, fallback to local mode.', error);
      }
      return false;
  },

  // Auth: Login
  login: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
    try {
      const result = await postJSON<{ success: boolean; user?: User; message?: string }>('/api/auth/login', { email, password });
      if (result.success && result.user) {
        const users = Store.getUsers();
        const idx = users.findIndex(u => u.email === result.user!.email);
        if (idx === -1) {
          users.push(result.user);
        } else {
          users[idx] = { ...users[idx], ...result.user };
        }
        localStorage.setItem('talent_finder_users', JSON.stringify(users));
        localStorage.setItem('talent_finder_current_user', JSON.stringify(result.user));
      }
      return result;
    } catch (error: any) {
      await delay(800);
      const users = Store.getUsers();
      const user = users.find(u => u.email === email);
      if (!user) return { success: false, message: "User not found." };
      if (user.passwordHash !== hashPassword(password)) {
          return { success: false, message: "Invalid password." };
      }
      if (!user.emailVerified && user.role !== 'admin' && !user.isDemo) {
          return { success: false, message: "Email not verified." };
      }
      localStorage.setItem('talent_finder_current_user', JSON.stringify(user));
      console.warn('Remote login failed, fallback to local mode.', error);
      return { success: true, user };
    }
  },

  // Get Demo User Helper
  getDemoUser: (role: 'company' | 'applicant'): User | undefined => {
      if (!DEMO_MODE_ENABLED) {
          return undefined;
      }
      const users = Store.getUsers();
      if (role === 'company') {
          return users.find(u => u.email === 'demo@company.com');
      } else {
          return users.find(u => u.email === 'demo@applicant.com');
      }
  },

  // Auth: Onboarding - Company
  saveCompanyProfile: async (userId: string, profile: Omit<CompanyProfile, 'userId'>) => {
      await delay(800);
      const companies = JSON.parse(localStorage.getItem('talent_finder_companies') || '[]');
      const newProfile = { ...profile, userId };
      companies.push(newProfile);
      localStorage.setItem('talent_finder_companies', JSON.stringify(companies));

      // Update User
      const users = Store.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
          users[idx].onboardingComplete = true;
          users[idx].name = profile.companyName; // Use company name as display name
          localStorage.setItem('talent_finder_users', JSON.stringify(users));
          localStorage.setItem('talent_finder_current_user', JSON.stringify(users[idx])); // Update session
      }

      try {
          await postJSON('/api/auth/onboarding', {
              userId,
              role: 'company',
              displayName: profile.companyName,
              profile
          });
      } catch (error) {
          console.warn('Remote onboarding sync failed (company).', error);
      }
  },

  // Company Profile Management
  getCompanyProfile: (userId: string): CompanyProfile | undefined => {
      const companies = JSON.parse(localStorage.getItem('talent_finder_companies') || '[]');
      return companies.find((c: any) => c.userId === userId);
  },

  updateCompanyProfile: async (userId: string, profile: Omit<CompanyProfile, 'userId'>) => {
      await delay(600);
      const companies = JSON.parse(localStorage.getItem('talent_finder_companies') || '[]');
      const idx = companies.findIndex((c: any) => c.userId === userId);
      
      if (idx !== -1) {
          companies[idx] = { ...profile, userId };
          localStorage.setItem('talent_finder_companies', JSON.stringify(companies));

          // Update User name if company name changed
          const users = Store.getUsers();
          const userIdx = users.findIndex(u => u.id === userId);
          if (userIdx !== -1 && users[userIdx].name !== profile.companyName) {
              users[userIdx].name = profile.companyName;
              localStorage.setItem('talent_finder_users', JSON.stringify(users));
              
              // Update session if it's the current user
              const currentUser = Store.getCurrentUser();
              if (currentUser && currentUser.id === userId) {
                  currentUser.name = profile.companyName;
                  localStorage.setItem('talent_finder_current_user', JSON.stringify(currentUser));
              }
          }
          return true;
      }
      return false;
  },

  // AI Settings Management
  getCompanyAISettings: (companyId: string): CompanyAISettings => {
      const allSettings = JSON.parse(localStorage.getItem('talent_finder_company_ai_settings') || '{}');
      if (allSettings[companyId]) {
          return allSettings[companyId];
      }
      
      // Default Settings
      return {
          id: crypto.randomUUID(),
          companyId,
          agentName: 'Sarah (AI)',
          tone: 'Professional',
          style: 'Behavioral',
          sliders: { formality: 70, strictness: 50, pacing: 50, detail: 60 },
          customQuestions: [],
          autoFollowUp: true,
          trainingData: { mission: '', roles: '', stack: '', redFlags: '', idealProfile: '' },
          voice: { voiceId: 'voice_female_1', pitch: 50, speed: 50, intonation: 50, enabled: true },
          flow: { 
              maxLength: 30, 
              maxQuestions: 5, 
              decisionTree: 'Linear',
              criteriaWeights: { personality: 20, communication: 20, technical: 40, cultural: 10, problemSolving: 10 }
          },
          updatedAt: new Date().toISOString()
      };
  },

  saveCompanyAISettings: async (companyId: string, settings: CompanyAISettings) => {
      await delay(500);
      const allSettings = JSON.parse(localStorage.getItem('talent_finder_company_ai_settings') || '{}');
      allSettings[companyId] = { ...settings, companyId, updatedAt: new Date().toISOString() };
      localStorage.setItem('talent_finder_company_ai_settings', JSON.stringify(allSettings));
      return true;
  },

  // Auth: Onboarding - Applicant
  saveApplicantProfile: async (userId: string, profile: Omit<ApplicantProfile, 'userId'>) => {
      await delay(800);
      const applicants = JSON.parse(localStorage.getItem('talent_finder_applicants') || '[]');
      const newProfile = { ...profile, userId };
      applicants.push(newProfile);
      localStorage.setItem('talent_finder_applicants', JSON.stringify(applicants));

      // Update User
      const users = Store.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
          users[idx].onboardingComplete = true;
          users[idx].name = profile.fullName; // Use full name as display name
          localStorage.setItem('talent_finder_users', JSON.stringify(users));
          localStorage.setItem('talent_finder_current_user', JSON.stringify(users[idx])); // Update session
      }

      try {
          await postJSON('/api/auth/onboarding', {
              userId,
              role: 'applicant',
              displayName: profile.fullName,
              profile
          });
      } catch (error) {
          console.warn('Remote onboarding sync failed (applicant).', error);
      }
  },

  getCurrentUser: (): User | null => {
    const u = localStorage.getItem('talent_finder_current_user');
    return u ? JSON.parse(u) : null;
  },

  getApplicantProfile: (userId: string): ApplicantProfile | undefined => {
    const applicants = JSON.parse(localStorage.getItem('talent_finder_applicants') || '[]');
    return applicants.find((a: ApplicantProfile) => a.userId === userId);
  },

  logout: () => {
    localStorage.removeItem('talent_finder_current_user');
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  updateUserStatus: (userId: string, status: 'active' | 'suspended') => {
      const users = Store.getUsers();
      const idx = users.findIndex(u => u.id === userId);
      if (idx !== -1) {
          users[idx].status = status;
          localStorage.setItem('talent_finder_users', JSON.stringify(users));
      }
  },

  adminLogin: async (email: string, password: string): Promise<{ success: boolean; user?: User; message?: string }> => {
      try {
          const result = await postJSON<{ success: boolean; token?: string; user?: User; message?: string }>(
            '/api/admin/login',
            { email, password }
          );
          if (result.success && result.user && result.token) {
              localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
              localStorage.setItem('talent_finder_current_user', JSON.stringify(result.user));
              return { success: true, user: result.user };
          }
          return { success: false, message: result.message || 'Admin login failed.' };
      } catch (error: any) {
          return { success: false, message: error?.message || 'Admin login failed.' };
      }
  },

  getAdminUsers: async (): Promise<User[]> => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return [];
      try {
          const result = await getJSON<{ users: User[] }>('/api/admin/users', token);
          return result.users || [];
      } catch (error) {
          console.warn('Failed to load admin users from API.', error);
          return [];
      }
  },

  updateAdminUserStatus: async (userId: string, status: 'active' | 'suspended'): Promise<boolean> => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return false;
      try {
          await patchJSON(`/api/admin/users/${userId}/status`, { status }, token);
          return true;
      } catch (error) {
          console.warn('Failed to update admin user status.', error);
          return false;
      }
  },

  getAdminUserProfile: async (userId: string): Promise<Record<string, any>> => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return {};
      try {
          const result = await getJSON<{ profile: Record<string, any> }>(`/api/admin/users/${userId}/profile`, token);
          return result.profile || {};
      } catch (error) {
          console.warn('Failed to load admin user profile.', error);
          return {};
      }
  },

  updateAdminUser: async (
      userId: string,
      payload: { name?: string; email?: string; password?: string; status?: 'active' | 'suspended' }
  ): Promise<{ success: boolean; user?: User; message?: string }> => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return { success: false, message: 'Admin not authenticated.' };
      try {
          const result = await patchJSON<{ success: boolean; user: User }>(`/api/admin/users/${userId}`, payload, token);
          return result;
      } catch (error: any) {
          return { success: false, message: error?.message || 'Failed to update user.' };
      }
  },

  updateAdminUserProfile: async (userId: string, profile: Record<string, any>): Promise<boolean> => {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY);
      if (!token) return false;
      try {
          await putJSON(`/api/admin/users/${userId}/profile`, profile, token);
          return true;
      } catch (error) {
          console.warn('Failed to update admin user profile.', error);
          return false;
      }
  },

  // Jobs
  getJobs: (): Job[] => {
    const jobs = localStorage.getItem('talent_finder_jobs');
    return jobs ? JSON.parse(jobs) : [];
  },

  createJob: async (job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
    await delay(600);
    const jobs = Store.getJobs();
    const newJob: Job = {
      ...job,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString()
    };
    localStorage.setItem('talent_finder_jobs', JSON.stringify([newJob, ...jobs]));
    return newJob;
  },

  getJobById: (id: string): Job | undefined => {
    return Store.getJobs().find(j => j.id === id);
  },

  getJobAISettings: (jobId: string): JobAISettings => {
    const allSettings = JSON.parse(localStorage.getItem('talent_finder_job_ai_settings') || '{}');
    if (allSettings[jobId]) {
      const stored = allSettings[jobId] as Partial<JobAISettings>;
      return {
        id: stored.id || crypto.randomUUID(),
        jobId,
        tone: stored.tone || 'Professional',
        priorityQuestions: stored.priorityQuestions || [],
        autoFollowUp: stored.autoFollowUp ?? true,
        scoringWeights: stored.scoringWeights || { transcript: 85, video: 15 },
        updatedAt: stored.updatedAt || new Date().toISOString(),
      };
    }

    return {
      id: crypto.randomUUID(),
      jobId,
      tone: 'Professional',
      priorityQuestions: [],
      autoFollowUp: true,
      scoringWeights: {
        transcript: 85,
        video: 15,
      },
      updatedAt: new Date().toISOString(),
    };
  },

  saveJobAISettings: async (
    jobId: string,
    settings: Omit<JobAISettings, 'id' | 'jobId' | 'updatedAt'>
  ): Promise<JobAISettings> => {
    await delay(300);
    const allSettings = JSON.parse(localStorage.getItem('talent_finder_job_ai_settings') || '{}');
    const current = allSettings[jobId] as JobAISettings | undefined;
    const nextSettings: JobAISettings = {
      id: current?.id || crypto.randomUUID(),
      jobId,
      tone: settings.tone,
      priorityQuestions: settings.priorityQuestions || [],
      autoFollowUp: settings.autoFollowUp,
      scoringWeights: settings.scoringWeights || { transcript: 85, video: 15 },
      updatedAt: new Date().toISOString(),
    };
    allSettings[jobId] = nextSettings;
    localStorage.setItem('talent_finder_job_ai_settings', JSON.stringify(allSettings));
    return nextSettings;
  },

  // Applications
  getApplications: (companyId?: string): Application[] => {
    const apps = JSON.parse(localStorage.getItem('talent_finder_apps') || '[]');
    if (companyId) {
      const jobs = Store.getJobs().filter(j => j.companyId === companyId);
      const jobIds = new Set(jobs.map(j => j.id));
      return apps.filter((a: Application) => jobIds.has(a.jobId));
    }
    return apps;
  },

  createApplication: async (appData: Omit<Application, 'id' | 'timestamp' | 'status'>, videos: Record<number, Blob>) => {
    await delay(1000);
    const apps = Store.getApplications();
    const newApp: Application = {
      ...appData,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      status: 'completed'
    };
    
    // Save metadata
    localStorage.setItem('talent_finder_apps', JSON.stringify([newApp, ...apps]));
    
    // Save video blobs in memory
    videoStorage.set(newApp.id, videos);
    
    return newApp;
  },

  getVideo: (applicationId: string, questionIndex: number): Blob | undefined => {
    const appVideos = videoStorage.get(applicationId);
    return appVideos ? appVideos[questionIndex] : undefined;
  },

  recalculateApplicationScoresForJob: async (
    jobId: string,
    weights: { transcript: number; video: number }
  ): Promise<number> => {
    await delay(300);
    const apps = JSON.parse(localStorage.getItem('talent_finder_apps') || '[]') as Application[];
    let updatedCount = 0;

    const nextApps = apps.map((app) => {
      if (app.jobId !== jobId) return app;

      const transcriptScore = app.transcriptMatchScore ?? app.matchScore ?? 50;
      const videoScore = app.videoMatchScore ?? 50;
      const nextMatchScore = Math.round(
        (transcriptScore * weights.transcript + videoScore * weights.video) / 100
      );

      updatedCount += 1;
      return {
        ...app,
        matchScore: nextMatchScore,
        scoringWeights: weights,
      };
    });

    localStorage.setItem('talent_finder_apps', JSON.stringify(nextApps));
    return updatedCount;
  },

  // Admin / System
  getSettings: (): SystemSettings => {
      return JSON.parse(localStorage.getItem('talent_finder_settings') || JSON.stringify({
          allowNewRegistrations: true,
          maintenanceMode: false,
          interviewDuration: 60
      }));
  },

  saveSettings: (settings: SystemSettings) => {
      localStorage.setItem('talent_finder_settings', JSON.stringify(settings));
  },

  getPrompts: (): AIPrompts => {
      const defaultPrompts = {
          questionGeneration: `Generate 3 distinct, challenging, and relevant interview questions for a candidate applying for the position of "{{jobTitle}}".\nThe requirements are: "{{requirements}}".\n\nQuestion 1 should be about technical/hard skills.\nQuestion 2 should be situational (STAR method).\nQuestion 3 should be about culture fit or soft skills.\n\nReturn ONLY the questions as a JSON array of strings.`,
          profileGeneration: `Role: {{jobTitle}}\nRequirements: {{requirements}}\n\nInterview Transcript:\n{{transcript}}\n\nBased ONLY on the interview answers, generate a detailed candidate profile JSON.\n1. "summary": A professional summary of the candidate suitable for a resume.\n2. "skills": A list of hard and soft skills demonstrated.\n3. "strengths": Key strengths observed.\n4. "suggestedRole": A specific niche/level (e.g., "Senior Backend Dev").\n5. "finalMatchScore": Adjust the average score ({{avgScore}}) based on fit.\n6. "formattedResume": A clean, professional Resume/CV string in Markdown format. Structure it with sections: "Professional Summary", "Key Skills", "Interview Performance Highlights". Infer details where logical but stay true to the transcript.`
      };
      return JSON.parse(localStorage.getItem('talent_finder_prompts') || JSON.stringify(defaultPrompts));
  },

  savePrompts: (prompts: AIPrompts) => {
      localStorage.setItem('talent_finder_prompts', JSON.stringify(prompts));
  },

  getAnalytics: (): AnalyticsData => {
      const users = Store.getUsers();
      const jobs = Store.getJobs();
      const apps = Store.getApplications();
      
      // Mock calculations
      return {
          totalUsers: users.length,
          totalJobs: jobs.length,
          totalInterviews: apps.length,
          apiCost: apps.length * 0.05 + 1.25, // Mock cost
          revenue: jobs.length * 50 // Mock revenue
      };
  },
  
  // Initialize some demo data if empty
  init: () => {
    if (!localStorage.getItem('talent_finder_jobs') && DEMO_MODE_ENABLED) {
      const demoJobs: Job[] = [
        {
          id: '1',
          companyId: 'demo_company',
          title: 'Senior Frontend Engineer',
          description: 'We are looking for a React expert to lead our frontend team.',
          requirements: 'React, TypeScript, Tailwind CSS, 5+ years experience',
          skills: ['React', 'TypeScript', 'Node.js'],
          executionAreas: ['Frontend', 'Web Apps', 'UI Engineering'],
          workType: 'Hybrid',
          geography: 'Portugal',
          contractType: 'Full-time',
          seniority: 'Senior',
          salaryMin: 38000,
          salaryMax: 52000,
          requiredLanguages: ['Portuguese (C1)', 'English (B2)'],
          mustHaveSkills: ['React', 'TypeScript'],
          niceToHaveSkills: ['Design Systems', 'Node.js'],
          interviewStyle: 'Technical',
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          companyId: 'demo_company',
          title: 'Product Manager',
          description: 'Lead the vision for our new AI product line.',
          requirements: 'Product strategy, Agile, User Research, Communication',
          skills: ['Agile', 'Strategy', 'Communication'],
          executionAreas: ['Product', 'AI Products'],
          workType: 'Remote',
          geography: 'Portugal',
          contractType: 'Contract',
          seniority: 'Mid',
          salaryMin: 30000,
          salaryMax: 45000,
          requiredLanguages: ['Portuguese (B2)', 'English (C1)'],
          mustHaveSkills: ['Agile', 'Stakeholder Management'],
          niceToHaveSkills: ['Data Analysis', 'LLM Product'],
          interviewStyle: 'Mixed',
          createdAt: new Date().toISOString()
        }
      ];
      localStorage.setItem('talent_finder_jobs', JSON.stringify(demoJobs));
    }
    
    if (!localStorage.getItem('talent_finder_users') && DEMO_MODE_ENABLED) {
        const demoUsers: User[] = [
            // Admin Account (Verified, Complete)
            { 
                id: 'admin_user', 
                name: 'System Admin', 
                email: 'admin@talentfinder.com',
                role: 'admin', 
                passwordHash: hashPassword('password123'),
                status: 'active', 
                emailVerified: true,
                onboardingComplete: true,
                isDemo: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            // Demo Company (Live Demo User)
            { 
                id: 'demo_company', 
                name: 'Demo Corp (Live)', 
                email: 'demo@company.com', 
                role: 'company', 
                passwordHash: hashPassword('password123'),
                status: 'active',
                emailVerified: true,
                onboardingComplete: true,
                isDemo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            // Demo Applicant (Live Demo User)
            { 
                id: 'demo_applicant', 
                name: 'Demo Candidate (Live)', 
                email: 'demo@applicant.com', 
                role: 'applicant', 
                passwordHash: hashPassword('password123'),
                status: 'active',
                emailVerified: true,
                onboardingComplete: true,
                isDemo: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        localStorage.setItem('talent_finder_users', JSON.stringify(demoUsers));
        
        // Init Profiles
        localStorage.setItem('talent_finder_companies', JSON.stringify([{
            userId: 'demo_company',
            companyName: 'Demo Corp (Live)',
            website: 'https://demo.example.com',
            size: '51-200',
            industry: 'Technology',
            country: 'USA',
            contactPerson: 'Demo Manager',
            contactPhone: '555-0199'
        }]));
        
        localStorage.setItem('talent_finder_applicants', JSON.stringify([{
            userId: 'demo_applicant',
            fullName: 'Demo Candidate (Live)',
            country: 'USA',
            linkedInUrl: 'https://linkedin.com/in/democandidate',
            executionAreas: ['Frontend', 'Product'],
            preferredWorkTypes: ['Remote', 'Hybrid'],
            preferredGeographies: ['Portugal', 'Spain', 'EU'],
            preferredContractTypes: ['Full-time', 'Contract'],
            seniority: 'Mid',
            salaryExpectationMin: 30000,
            salaryExpectationMax: 50000,
            availability: '1 Month',
            languages: ['English (C1)', 'Portuguese (B1)']
        }]));

        // Create a Mock Application for Demo Company to view
        const mockApp: Application = {
            id: 'mock_app_1',
            jobId: '1', // Senior Frontend Engineer
            applicantId: 'demo_applicant',
            applicantName: 'Sarah Smith (Sample)',
            status: 'completed',
            matchScore: 88,
            timestamp: new Date().toISOString(),
            aiResume: {
                summary: "Sarah is a highly experienced Frontend Engineer with a strong command of React and TypeScript. She demonstrated excellent problem-solving skills and a deep understanding of modern web architecture.",
                skills: ["React", "TypeScript", "Performance Optimization", "Team Leadership"],
                strengths: ["Clear Communication", "Technical Depth", "Pragmatism"],
                suggestedRole: "Senior Frontend Engineer",
                formattedResume: "# Sarah Smith\n\n## Professional Summary\nExperienced frontend developer specializing in scalable React applications.\n\n## Key Skills\n- **Frontend**: React, TypeScript, Tailwind\n- **Soft Skills**: Mentorship, Agile Communication"
            },
            transcripts: [
                {
                    question: "Can you describe a challenging project you worked on?",
                    answer: "In my last role, I led the migration of a legacy monolithic app to a micro-frontend architecture using React. It improved load times by 40%."
                },
                {
                    question: "How do you handle tight deadlines?",
                    answer: "I prioritize tasks based on impact and communicate early if adjustments are needed. I also focus on unblocking the team first."
                }
            ]
        };
        localStorage.setItem('talent_finder_apps', JSON.stringify([mockApp]));
    }
  }
};

Store.init();
