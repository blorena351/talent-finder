
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Interview } from './components/Interview';
import { Landing } from './components/Landing';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { Store, User, Job } from './services/store';
import { generateCandidateProfile } from './services/gemini';
import { useI18n } from './services/i18n';
import { LanguageSwitcher } from './components/LanguageSwitcher';

const App: React.FC = () => {
  const { t } = useI18n();
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'landing' | 'auth' | 'dashboard' | 'interview' | 'features' | 'how-it-works' | 'pricing'>('landing');
  const [authRole, setAuthRole] = useState<'company' | 'applicant' | 'admin'>('applicant');
  const [interviewJob, setInterviewJob] = useState<Job | null>(null);

  useEffect(() => {
    const currentUser = Store.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setView('dashboard');
    } else {
        // If not logged in, default to landing
        setView('landing');
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    Store.logout();
    setUser(null);
    setView('landing');
  };

  const handleStartInterview = (job: Job) => {
    setInterviewJob(job);
    setView('interview');
  };

  const handleInterviewComplete = async (
    transcripts: {question: string, answer: string, score: number}[],
    videoAnalyses: { question: string; summary: string; confidence: number }[],
    videos: Record<number, Blob>
  ) => {
    if (!user || !interviewJob) return;
    const jobAISettings = Store.getJobAISettings(interviewJob.id);
    const transcriptWeight = jobAISettings.scoringWeights?.transcript ?? 85;
    const videoWeight = jobAISettings.scoringWeights?.video ?? 15;

    if (user.isDemo) {
        // In Demo mode, we simulate the success but don't persist data
        const profile = await generateCandidateProfile(interviewJob.title, interviewJob.requirements, transcripts);
        
        // Show what would have been saved
        console.log("DEMO MODE: Generated Profile", profile);
        alert(`DEMO MODE: Interview Complete!\n\nAI Match Score: ${profile.finalMatchScore}%\n\nNote: As this is a demo, your application and video data have NOT been saved to the permanent record.`);
        
        setView('dashboard');
        setInterviewJob(null);
        return;
    }

    // Generate Profile
    const profile = await generateCandidateProfile(interviewJob.title, interviewJob.requirements, transcripts);
    const transcriptMatchScore = profile.finalMatchScore;
    const videoMatchScore = videoAnalyses.length
      ? Math.round(videoAnalyses.reduce((acc, item) => acc + item.confidence, 0) / videoAnalyses.length)
      : 50;
    const finalWeightedScore = Math.round(
      (transcriptMatchScore * transcriptWeight + videoMatchScore * videoWeight) / 100
    );
    const executionLevel: 'high' | 'medium' | 'low' =
      finalWeightedScore >= 80 ? 'high' : finalWeightedScore >= 60 ? 'medium' : 'low';

    // Save Application
    await Store.createApplication({
        jobId: interviewJob.id,
        applicantId: user.id,
        applicantName: user.name,
        executionLevel,
        matchScore: finalWeightedScore,
        transcriptMatchScore,
        videoMatchScore,
        scoringWeights: { transcript: transcriptWeight, video: videoWeight },
        aiResume: profile,
        transcripts: transcripts.map(t => ({ question: t.question, answer: t.answer })),
        videoAnalyses,
    }, videos);

    alert("Interview submitted successfully! The company will review your AI profile.");
    setView('dashboard');
    setInterviewJob(null);
  };

  const handleCancelInterview = () => {
    setView('dashboard');
    setInterviewJob(null);
  };

  // Render Logic
  if (!user) {
    if (view === 'auth') {
        return (
            <Auth 
                onLogin={handleLogin} 
                initialRole={authRole} 
                onBack={() => setView('landing')} 
            />
        );
    }
    if (view === 'features') {
        return (
            <Features 
                onBack={() => setView('landing')}
                onLoginClick={() => {
                    setAuthRole('applicant'); 
                    setView('auth');
                }}
                onGetStarted={() => {
                    setAuthRole('applicant'); 
                    setView('auth');
                }}
                onViewHowItWorks={() => setView('how-it-works')}
                onViewPricing={() => setView('pricing')}
            />
        );
    }
    if (view === 'how-it-works') {
        return (
            <HowItWorks 
                onBack={() => setView('landing')}
                onLoginClick={() => {
                    setAuthRole('applicant'); 
                    setView('auth');
                }}
                onGetStarted={(role) => {
                    setAuthRole(role); 
                    setView('auth');
                }}
                onViewPricing={() => setView('pricing')}
            />
        );
    }
    if (view === 'pricing') {
        return (
            <Pricing 
                onBack={() => setView('landing')}
                onLoginClick={() => {
                    setAuthRole('applicant'); 
                    setView('auth');
                }}
                onGetStarted={(role) => {
                    setAuthRole(role); 
                    setView('auth');
                }}
                onViewFeatures={() => setView('features')}
                onViewHowItWorks={() => setView('how-it-works')}
            />
        );
    }
    return (
        <Landing 
            onLoginClick={() => {
                setAuthRole('applicant'); // Default
                setView('auth');
            }}
            onGetStarted={(role) => {
                setAuthRole(role);
                setView('auth');
            }}
            onViewFeatures={() => setView('features')}
            onViewHowItWorks={() => setView('how-it-works')}
            onViewPricing={() => setView('pricing')}
        />
    );
  }

  // Authenticated Views
  if (view === 'interview' && interviewJob) {
    return (
        <Interview 
            job={interviewJob} 
            applicantName={user.name} 
            onComplete={handleInterviewComplete} 
            onCancel={handleCancelInterview} 
        />
    );
  }

  return (
    <div className="min-h-screen text-zinc-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-700/40 bg-slate-950/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-16 py-2 flex flex-wrap gap-y-2 items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-md shadow-blue-500/30">T</div>
                <span className="font-bold text-lg tracking-tight">Talent Finder</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 ml-auto">
                <div className="text-sm text-zinc-400 hidden sm:block">
                    {t('app_logged_as', 'Logged in as')} <span className="text-white font-medium">{user.name}</span> ({user.role})
                </div>
                <LanguageSwitcher />
                <button 
                    onClick={handleLogout}
                    className="text-xs font-medium border border-slate-600 hover:bg-slate-800/80 px-3 py-1.5 rounded-full transition-colors"
                >
                    {t('app_sign_out', 'Sign Out')}
                </button>
            </div>
        </div>
      </header>

      <main>
        <Dashboard user={user} onStartInterview={handleStartInterview} />
      </main>
    </div>
  );
};

export default App;
