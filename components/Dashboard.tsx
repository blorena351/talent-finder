/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { User, Job, Application, Store } from '../services/store';
import { PlusIcon, BriefcaseIcon, UserGroupIcon, VideoCameraIcon, DocumentTextIcon, CheckBadgeIcon, ArrowUpTrayIcon, ClockIcon, PlayCircleIcon, FunnelIcon, MagnifyingGlassIcon, BuildingOfficeIcon, SparklesIcon, LockClosedIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { AdminDashboard } from './AdminDashboard';
import { CompanySettings } from './CompanySettings';
import { useI18n } from '../services/i18n';

interface DashboardProps {
  user: User;
  onStartInterview: (job: Job) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartInterview }) => {
  const { language } = useI18n();
  const tr = (en: string, pt: string, es: string) => (language === 'pt-PT' ? pt : language === 'es' ? es : en);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showEditJobAIModal, setShowEditJobAIModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [newJobForm, setNewJobForm] = useState<{
    title: string;
    description: string;
    requirements: string;
    skills: string;
    executionAreasText: string;
    workType: 'Remote' | 'Hybrid' | 'On-site';
    geography: string;
    contractType: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance';
    seniority: 'Junior' | 'Mid' | 'Senior' | 'Lead';
    salaryMin: string;
    salaryMax: string;
    requiredLanguagesText: string;
    mustHaveSkillsText: string;
    niceToHaveSkillsText: string;
    interviewStyle: 'Technical' | 'Behavioral' | 'Mixed' | 'Casual';
    aiTone: 'Professional' | 'Friendly' | 'Neutral' | 'Energetic' | 'Calm';
    priorityQuestionsText: string;
    transcriptWeight: number;
  }>({ 
    title: '', 
    description: '', 
    requirements: '', 
    skills: '',
    executionAreasText: '',
    workType: 'Hybrid',
    geography: '',
    contractType: 'Full-time',
    seniority: 'Mid',
    salaryMin: '',
    salaryMax: '',
    requiredLanguagesText: '',
    mustHaveSkillsText: '',
    niceToHaveSkillsText: '',
    interviewStyle: 'Mixed',
    aiTone: 'Professional',
    priorityQuestionsText: '',
    transcriptWeight: 85
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [editJobAIForm, setEditJobAIForm] = useState<{
    aiTone: 'Professional' | 'Friendly' | 'Neutral' | 'Energetic' | 'Calm';
    priorityQuestionsText: string;
    transcriptWeight: number;
    applyToExistingApplications: boolean;
  }>({
    aiTone: 'Professional',
    priorityQuestionsText: '',
    transcriptWeight: 85,
    applyToExistingApplications: false,
  });
  
  // Company Dashboard View State
  const [companyView, setCompanyView] = useState<'dashboard' | 'settings'>('dashboard');

  // Company Profile State
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [companyProfileForm, setCompanyProfileForm] = useState({
      companyName: '',
      website: '',
      size: '1-10',
      industry: '',
      country: '',
      contactPerson: '',
      contactPhone: '',
      description: ''
  });
  
  // Filter States
  const [filterStatus, setFilterStatus] = useState<'all' | 'high_match' | 'reviewed'>('all');
  const [filterExecutionLevel, setFilterExecutionLevel] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [filterCandidateCountry, setFilterCandidateCountry] = useState<string>('all');
  const [filterCandidateArea, setFilterCandidateArea] = useState<string>('all');
  const [filterCandidateSeniority, setFilterCandidateSeniority] = useState<'all' | 'Junior' | 'Mid' | 'Senior' | 'Lead'>('all');
  const [filterCandidateAvailability, setFilterCandidateAvailability] = useState<'all' | 'Immediate' | '2 Weeks' | '1 Month' | '2+ Months'>('all');
  const [filterCandidateContractType, setFilterCandidateContractType] = useState<'all' | 'Full-time' | 'Part-time' | 'Contract' | 'Freelance'>('all');
  const [filterCandidateLanguage, setFilterCandidateLanguage] = useState<string>('all');
  const [filterCandidateSalary, setFilterCandidateSalary] = useState<'all' | 'within_budget' | 'above_budget'>('all');
  
  // Applicant specific state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');
  const [jobFilterWorkType, setJobFilterWorkType] = useState<'all' | 'Remote' | 'Hybrid' | 'On-site'>('all');
  const [jobFilterGeography, setJobFilterGeography] = useState<string>('all');
  const [jobFilterArea, setJobFilterArea] = useState<string>('all');
  const [jobFilterContractType, setJobFilterContractType] = useState<'all' | 'Full-time' | 'Part-time' | 'Contract' | 'Freelance'>('all');
  const [jobFilterSeniority, setJobFilterSeniority] = useState<'all' | 'Junior' | 'Mid' | 'Senior' | 'Lead'>('all');
  const [jobFilterAvailabilityFit, setJobFilterAvailabilityFit] = useState<'all' | 'quick'>('all');
  const [jobFilterSalaryFit, setJobFilterSalaryFit] = useState<'all' | 'fit'>('all');
  const [jobFilterLanguage, setJobFilterLanguage] = useState<string>('all');
  const [jobFilterMustHave, setJobFilterMustHave] = useState<string>('all');

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    const allJobs = Store.getJobs();
    const allApps = Store.getApplications();
    
    if (user.role === 'company') {
      const companyJobs = allJobs.filter(job => job.companyId === user.id);
      setJobs(companyJobs);
      // Filter for company's jobs
      const companyApps = allApps.filter(app => {
        const job = allJobs.find(j => j.id === app.jobId);
        return job?.companyId === user.id;
      });
      setApplications(companyApps);
    } else if (user.role === 'applicant') {
      setJobs(allJobs);
      // Filter for applicant's applications
      const myApps = allApps.filter(app => app.applicantId === user.id);
      setMyApplications(myApps);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (user.isDemo) {
        alert("Action disabled in Demo Mode.");
        return;
    }
    const createdJob = await Store.createJob({
        title: newJobForm.title,
        description: newJobForm.description,
        requirements: newJobForm.requirements,
        skills: newJobForm.skills.split(',').map(s => s.trim()).filter(s => s),
        executionAreas: newJobForm.executionAreasText.split(',').map(s => s.trim()).filter(Boolean),
        workType: newJobForm.workType,
        geography: newJobForm.geography.trim(),
        contractType: newJobForm.contractType,
        seniority: newJobForm.seniority,
        salaryMin: newJobForm.salaryMin ? parseInt(newJobForm.salaryMin) : undefined,
        salaryMax: newJobForm.salaryMax ? parseInt(newJobForm.salaryMax) : undefined,
        requiredLanguages: newJobForm.requiredLanguagesText.split(',').map(s => s.trim()).filter(Boolean),
        mustHaveSkills: newJobForm.mustHaveSkillsText.split(',').map(s => s.trim()).filter(Boolean),
        niceToHaveSkills: newJobForm.niceToHaveSkillsText.split(',').map(s => s.trim()).filter(Boolean),
        interviewStyle: newJobForm.interviewStyle,
        companyId: user.id
    });
    const priorityQuestions = newJobForm.priorityQuestionsText
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean);
    await Store.saveJobAISettings(createdJob.id, {
      tone: newJobForm.aiTone,
      priorityQuestions,
      autoFollowUp: true,
      scoringWeights: {
        transcript: newJobForm.transcriptWeight,
        video: 100 - newJobForm.transcriptWeight,
      },
    });
    setShowCreateJob(false);
    setNewJobForm({
      title: '',
      description: '',
      requirements: '',
      skills: '',
      executionAreasText: '',
      workType: 'Hybrid',
      geography: '',
      contractType: 'Full-time',
      seniority: 'Mid',
      salaryMin: '',
      salaryMax: '',
      requiredLanguagesText: '',
      mustHaveSkillsText: '',
      niceToHaveSkillsText: '',
      interviewStyle: 'Mixed',
      aiTone: 'Professional',
      priorityQuestionsText: '',
      transcriptWeight: 85,
    });
    refreshData();
  };
  
  const handleOpenProfile = () => {
      const profile = Store.getCompanyProfile(user.id);
      if (profile) {
          setCompanyProfileForm({
              companyName: profile.companyName,
              website: profile.website,
              size: profile.size,
              industry: profile.industry,
              country: profile.country,
              contactPerson: profile.contactPerson,
              contactPhone: profile.contactPhone,
              description: profile.description || ''
          });
          setShowProfileModal(true);
      }
  };

  const handleOpenJobAISettings = (job: Job) => {
    const settings = Store.getJobAISettings(job.id);
    setEditingJob(job);
    setEditJobAIForm({
      aiTone: settings.tone,
      priorityQuestionsText: settings.priorityQuestions.join('\n'),
      transcriptWeight: settings.scoringWeights?.transcript ?? 85,
      applyToExistingApplications: false,
    });
    setShowEditJobAIModal(true);
  };

  const handleSaveJobAISettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;
    if (user.isDemo) {
      alert("Settings updates are disabled in Demo Mode.");
      return;
    }

    const existingSettings = Store.getJobAISettings(editingJob.id);
    const priorityQuestions = editJobAIForm.priorityQuestionsText
      .split('\n')
      .map(q => q.trim())
      .filter(Boolean);

    await Store.saveJobAISettings(editingJob.id, {
      tone: editJobAIForm.aiTone,
      priorityQuestions,
      autoFollowUp: existingSettings.autoFollowUp,
      scoringWeights: {
        transcript: editJobAIForm.transcriptWeight,
        video: 100 - editJobAIForm.transcriptWeight,
      },
    });

    if (editJobAIForm.applyToExistingApplications) {
      const updatedCount = await Store.recalculateApplicationScoresForJob(editingJob.id, {
        transcript: editJobAIForm.transcriptWeight,
        video: 100 - editJobAIForm.transcriptWeight,
      });
      alert(`Updated ranking score for ${updatedCount} existing application(s).`);
    }

    setShowEditJobAIModal(false);
    setEditingJob(null);
    refreshData();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
      e.preventDefault();
      if (user.isDemo) {
          alert("Profile updates are disabled in Demo Mode.");
          return;
      }
      await Store.updateCompanyProfile(user.id, companyProfileForm);
      setShowProfileModal(false);
      refreshData();
  };

  const handleViewApp = (app: Application) => {
    setSelectedApp(app);
    // Auto-select first video if available
    const blob = Store.getVideo(app.id, 0);
    if (blob) {
        setVideoUrl(URL.createObjectURL(blob));
    } else {
        setVideoUrl(null);
    }
  };

  const playVideo = (appId: string, index: number) => {
    const blob = Store.getVideo(appId, index);
    if (blob) {
        setVideoUrl(URL.createObjectURL(blob));
    } else {
        alert("Video not found in memory (session expired or demo data).");
    }
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user.isDemo) {
        alert("File uploads are disabled in Demo Mode.");
        return;
    }
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };

  const hasApplied = (jobId: string) => myApplications.some(app => app.jobId === jobId);

  // Filter Logic
  const currentApplicantProfile = user.role === 'applicant' ? Store.getApplicantProfile(user.id) : undefined;
  const filteredApplications = applications.filter(app => {
    const matchesJob = !selectedJobId || app.jobId === selectedJobId;
    const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'high_match' ? app.matchScore >= 80 :
        filterStatus === 'reviewed' ? app.status === 'reviewed' : true;
    const matchesExecutionLevel =
      filterExecutionLevel === 'all' ? true : app.executionLevel === filterExecutionLevel;
    const applicantProfile = Store.getApplicantProfile(app.applicantId);
    const applicantCountry = (applicantProfile?.country || '').trim();
    const matchesCountry =
      filterCandidateCountry === 'all' ? true : applicantCountry === filterCandidateCountry;
    const hasArea = app.aiResume?.skills?.some(skill => skill.toLowerCase().includes(filterCandidateArea.toLowerCase()));
    const matchesArea = filterCandidateArea === 'all' ? true : !!hasArea;
    const matchesSeniority =
      filterCandidateSeniority === 'all' ? true : applicantProfile?.seniority === filterCandidateSeniority;
    const matchesAvailability =
      filterCandidateAvailability === 'all' ? true : applicantProfile?.availability === filterCandidateAvailability;
    const matchesContractType =
      filterCandidateContractType === 'all'
        ? true
        : (applicantProfile?.preferredContractTypes || []).includes(filterCandidateContractType);
    const matchesLanguage =
      filterCandidateLanguage === 'all'
        ? true
        : (applicantProfile?.languages || []).some(l => l.toLowerCase().includes(filterCandidateLanguage.toLowerCase()));
    const job = jobs.find(j => j.id === app.jobId);
    const jobSalaryMax = job?.salaryMax || 0;
    const candidateSalaryMin = applicantProfile?.salaryExpectationMin || 0;
    const matchesSalary =
      filterCandidateSalary === 'all'
        ? true
        : filterCandidateSalary === 'within_budget'
        ? (jobSalaryMax > 0 && candidateSalaryMin > 0 ? candidateSalaryMin <= jobSalaryMax : true)
        : (jobSalaryMax > 0 && candidateSalaryMin > 0 ? candidateSalaryMin > jobSalaryMax : false);
    return matchesJob && matchesStatus && matchesExecutionLevel && matchesCountry && matchesArea && matchesSeniority && matchesAvailability && matchesContractType && matchesLanguage && matchesSalary;
  });
  const sortedApplications = [...filteredApplications].sort((a, b) => {
    const levelRank = (level?: 'high' | 'medium' | 'low') => (level === 'high' ? 3 : level === 'medium' ? 2 : 1);
    const byLevel = levelRank(b.executionLevel) - levelRank(a.executionLevel);
    if (byLevel !== 0) return byLevel;
    return b.matchScore - a.matchScore;
  });
  const candidateCountries = Array.from(
    new Set(
      applications
        .map(app => Store.getApplicantProfile(app.applicantId)?.country?.trim())
        .filter((c): c is string => !!c)
    )
  );
  const candidateAreas = Array.from(
    new Set(
      applications.flatMap(app => app.aiResume?.skills || [])
    )
  );
  const candidateSeniorities = Array.from(
    new Set(
      applications.map(app => Store.getApplicantProfile(app.applicantId)?.seniority).filter(Boolean)
    )
  ) as ('Junior' | 'Mid' | 'Senior' | 'Lead')[];
  const candidateLanguages = Array.from(
    new Set(
      applications.flatMap(app => Store.getApplicantProfile(app.applicantId)?.languages || [])
    )
  );
  const filteredJobsForApplicant = jobs.filter(job => {
    const matchesWorkType = jobFilterWorkType === 'all' ? true : (job.workType || 'Hybrid') === jobFilterWorkType;
    const matchesGeography = jobFilterGeography === 'all' ? true : (job.geography || '').trim() === jobFilterGeography;
    const matchesArea = jobFilterArea === 'all'
      ? true
      : (job.executionAreas || []).some(area => area.toLowerCase().includes(jobFilterArea.toLowerCase()));
    const matchesContractType = jobFilterContractType === 'all' ? true : (job.contractType || 'Full-time') === jobFilterContractType;
    const matchesSeniority = jobFilterSeniority === 'all' ? true : (job.seniority || 'Mid') === jobFilterSeniority;
    const matchesAvailability =
      jobFilterAvailabilityFit === 'all'
        ? true
        : !!currentApplicantProfile && ['Immediate', '2 Weeks'].includes(currentApplicantProfile.availability || '');
    const candidateMin = currentApplicantProfile?.salaryExpectationMin || 0;
    const jobMax = job.salaryMax || 0;
    const matchesSalaryFit =
      jobFilterSalaryFit === 'all'
        ? true
        : (candidateMin > 0 && jobMax > 0 ? candidateMin <= jobMax : true);
    const matchesLanguage =
      jobFilterLanguage === 'all'
        ? true
        : (job.requiredLanguages || []).some(l => l.toLowerCase().includes(jobFilterLanguage.toLowerCase()));
    const matchesMustHave =
      jobFilterMustHave === 'all'
        ? true
        : (job.mustHaveSkills || []).some(s => s.toLowerCase().includes(jobFilterMustHave.toLowerCase()));
    return matchesWorkType && matchesGeography && matchesArea && matchesContractType && matchesSeniority && matchesAvailability && matchesSalaryFit && matchesLanguage && matchesMustHave;
  });
  const availableGeographies = Array.from(new Set(jobs.map(job => (job.geography || '').trim()).filter(Boolean)));
  const availableAreas = Array.from(new Set(jobs.flatMap(job => job.executionAreas || [])));
  const availableContractTypes = Array.from(new Set(jobs.map(job => job.contractType || 'Full-time')));
  const availableSeniorities = Array.from(new Set(jobs.map(job => job.seniority || 'Mid')));
  const availableLanguages = Array.from(new Set(jobs.flatMap(job => job.requiredLanguages || [])));
  const availableMustHaves = Array.from(new Set(jobs.flatMap(job => job.mustHaveSkills || [])));

  // Shared Application Details Modal
  const renderApplicationModal = () => {
    if (!selectedApp) return null;
    return (
        <div className="fixed inset-0 z-40 bg-zinc-950 flex flex-col md:flex-row animate-in slide-in-from-bottom-10 duration-300">
            <div className="w-full md:w-2/3 bg-black flex flex-col items-center justify-center relative border-r border-zinc-800">
                <button onClick={() => setSelectedApp(null)} className="absolute top-4 left-4 text-white bg-zinc-800/50 hover:bg-zinc-700 p-2 rounded-full z-10 flex items-center gap-2 px-4">
                    <span>← Back</span>
                </button>
                {videoUrl ? (
                    <video src={videoUrl} controls autoPlay className="max-w-full max-h-[80vh] shadow-2xl" />
                ) : (
                    <div className="text-zinc-500 flex flex-col items-center p-8 text-center">
                        <VideoCameraIcon className="w-16 h-16 mb-4 opacity-20" />
                        <p>Select a question below to view the answer video.</p>
                        <p className="text-xs mt-2 text-zinc-600">(Videos are only stored for the current session)</p>
                    </div>
                )}
                
                {/* Video Selector */}
                <div className="absolute bottom-8 flex gap-2 overflow-x-auto max-w-full px-4 w-full justify-center">
                    {selectedApp.transcripts?.map((t, i) => (
                        <button key={i} onClick={() => playVideo(selectedApp.id, i)} className="bg-zinc-900/90 backdrop-blur border border-zinc-700 hover:border-blue-500 p-3 rounded-lg w-48 text-left transition-all shrink-0">
                            <div className="text-[10px] text-zinc-500 uppercase font-bold mb-1">Question {i+1}</div>
                            <div className="text-xs text-zinc-300 truncate w-full">{t.question}</div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full md:w-1/3 bg-zinc-900 overflow-y-auto p-8 border-l border-zinc-800">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">{selectedApp.applicantName}</h2>
                        <p className="text-sm text-zinc-500">Applied on {new Date(selectedApp.timestamp).toLocaleDateString()}</p>
                    </div>
                    <div className={`text-lg font-bold px-3 py-1 rounded-full ${selectedApp.matchScore > 80 ? 'bg-green-500/20 text-green-400' : selectedApp.matchScore > 60 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                        {selectedApp.matchScore}% Match
                    </div>
                </div>

                <div className="space-y-8">
                    {/* Scoring Breakdown */}
                    <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                        <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Scoring Breakdown</h3>
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Transcript Score</span>
                                <span>{selectedApp.transcriptMatchScore ?? selectedApp.matchScore}%</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Video Score</span>
                                <span>{selectedApp.videoMatchScore ?? 50}%</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-300">
                                <span>Weights</span>
                                <span>
                                    T {selectedApp.scoringWeights?.transcript ?? 85}% / V {selectedApp.scoringWeights?.video ?? 15}%
                                </span>
                            </div>
                            <div className="pt-2 border-t border-zinc-700 flex items-center justify-between font-bold text-white">
                                <span>Final Ranking Score</span>
                                <span>{selectedApp.matchScore}%</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Resume */}
                    <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-blue-400 uppercase tracking-wider mb-4">
                            <DocumentTextIcon className="w-4 h-4" /> AI Generated Profile
                        </h3>
                        {selectedApp.aiResume ? (
                            <div className="space-y-6">
                                {/* Formatted Resume View */}
                                {selectedApp.aiResume.formattedResume ? (
                                    <div className="bg-white/5 p-4 rounded-lg font-serif text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed border border-zinc-700/50 shadow-inner">
                                        {selectedApp.aiResume.formattedResume}
                                    </div>
                                ) : (
                                    <p className="text-zinc-500 italic">Formatting resume...</p>
                                )}
                                
                                <div className="border-t border-zinc-700 pt-4 mt-4">
                                     <h4 className="text-xs text-zinc-500 uppercase mb-2">Detailed Breakdown</h4>
                                     <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedApp.aiResume.skills.map((s, idx) => (
                                            <span key={idx} className="px-2 py-1 bg-zinc-700 rounded text-xs text-zinc-300">{s}</span>
                                        ))}
                                    </div>
                                    <p className="text-sm text-zinc-400"><span className="text-zinc-500">Suggested Role:</span> {selectedApp.aiResume.suggestedRole}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-zinc-500 text-sm">Profile generation pending...</p>
                        )}
                    </div>

                    {/* Transcript Analysis */}
                    <div>
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Interview Transcripts</h3>
                            <div className="space-y-4">
                            {selectedApp.transcripts?.map((t, i) => (
                                <div key={i} className="border-l-2 border-zinc-700 pl-4 py-1">
                                    <div className="text-xs text-zinc-500 mb-1">Q: {t.question}</div>
                                    <div className="text-sm text-zinc-300 italic">"{t.answer.substring(0, 150)}..."</div>
                                </div>
                            ))}
                            </div>
                    </div>

                    {/* Video Analysis (separate from transcript-based summary) */}
                    <div>
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4">Video Analysis</h3>
                            <div className="space-y-4">
                            {selectedApp.videoAnalyses?.map((v, i) => (
                                <div key={i} className="border-l-2 border-blue-700/50 pl-4 py-1">
                                    <div className="text-xs text-zinc-500 mb-1">Q: {v.question}</div>
                                    <div className="text-sm text-zinc-300">{v.summary}</div>
                                    <div className="text-xs text-zinc-500 mt-1">Confidence: {v.confidence}%</div>
                                </div>
                            ))}
                            {(!selectedApp.videoAnalyses || selectedApp.videoAnalyses.length === 0) && (
                                <p className="text-zinc-500 text-sm">No video analysis available for this interview.</p>
                            )}
                            </div>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  const DemoBanner = () => {
      if (!user.isDemo) return null;
      return (
          <div className="bg-blue-600/10 border-b border-blue-500/20 text-center py-2 px-4 text-xs md:text-sm text-blue-300 font-medium flex items-center justify-center gap-2">
              <SparklesIcon className="w-4 h-4 text-yellow-500" />
              {tr(
                'You are viewing a demo version. Some features (saving, uploading) are limited.',
                'Está a ver uma versão demo. Algumas funcionalidades (guardar, upload) estão limitadas.',
                'Estás viendo una versión demo. Algunas funciones (guardar, subir archivos) están limitadas.'
              )}
          </div>
      );
  };

  // ADMIN VIEW
  if (user.role === 'admin') {
      return <AdminDashboard />;
  }

  // Company View
  if (user.role === 'company') {
    return (
      <div className="min-h-[calc(100vh-64px)]">
        <DemoBanner />
        
        {/* Company Settings View */}
        {companyView === 'settings' ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <CompanySettings companyId={user.id} onClose={() => setCompanyView('dashboard')} />
            </div>
        ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {renderApplicationModal()}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-white">{tr('Company Dashboard', 'Painel da Empresa', 'Panel de Empresa')}</h1>
                    <p className="text-zinc-400">{tr('Manage jobs, review talent, and analyze interviews.', 'Gerir vagas, rever talento e analisar entrevistas.', 'Gestiona vacantes, revisa talento y analiza entrevistas.')}</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setCompanyView('settings')}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-zinc-700 group"
                    >
                        <Cog6ToothIcon className="w-5 h-5 group-hover:rotate-90 transition-transform" /> AI Interviewer
                    </button>
                    <button 
                        onClick={handleOpenProfile}
                        className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-zinc-700"
                    >
                        <BuildingOfficeIcon className="w-5 h-5" /> Profile
                    </button>
                    <button 
                        onClick={() => setShowCreateJob(true)}
                        className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-lg ${user.isDemo ? 'bg-zinc-700 cursor-not-allowed opacity-75' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-500/20'}`}
                    >
                        <PlusIcon className="w-5 h-5" /> {tr('Post New Job', 'Publicar Nova Vaga', 'Publicar Nueva Vacante')}
                    </button>
                </div>
            </div>

            {/* Company Profile Modal */}
            {showProfileModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleSaveProfile} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <BuildingOfficeIcon className="w-6 h-6 text-blue-500" />
                                {tr('Manage Profile', 'Gerir Perfil', 'Gestionar Perfil')}
                            </h2>
                            <button type="button" onClick={() => setShowProfileModal(false)} className="text-zinc-500 hover:text-white">✕</button>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Company Name</label>
                                <input type="text" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.companyName} onChange={e => setCompanyProfileForm({...companyProfileForm, companyName: e.target.value})} disabled={!!user.isDemo} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Website</label>
                                <input type="url" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.website} onChange={e => setCompanyProfileForm({...companyProfileForm, website: e.target.value})} disabled={!!user.isDemo} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Company Size</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.size} onChange={e => setCompanyProfileForm({...companyProfileForm, size: e.target.value})} disabled={!!user.isDemo}>
                                    <option>1-10</option>
                                    <option>11-50</option>
                                    <option>51-200</option>
                                    <option>200+</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Industry</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.industry} onChange={e => setCompanyProfileForm({...companyProfileForm, industry: e.target.value})} disabled={!!user.isDemo} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Country</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.country} onChange={e => setCompanyProfileForm({...companyProfileForm, country: e.target.value})} disabled={!!user.isDemo} />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Description</label>
                                <textarea className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none h-24"
                                    value={companyProfileForm.description} onChange={e => setCompanyProfileForm({...companyProfileForm, description: e.target.value})} 
                                    placeholder="Tell us about your company culture and values..." disabled={!!user.isDemo} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Contact Person</label>
                                <input type="text" required className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.contactPerson} onChange={e => setCompanyProfileForm({...companyProfileForm, contactPerson: e.target.value})} disabled={!!user.isDemo} />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Phone</label>
                                <input type="tel" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                                    value={companyProfileForm.contactPhone} onChange={e => setCompanyProfileForm({...companyProfileForm, contactPhone: e.target.value})} disabled={!!user.isDemo} />
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                            {user.isDemo && <span className="text-xs text-yellow-500 mr-auto self-center">Read-only in Demo Mode</span>}
                            <button type="button" onClick={() => setShowProfileModal(false)} className="text-zinc-400 hover:text-white px-4 py-2">{tr('Cancel', 'Cancelar', 'Cancelar')}</button>
                            {!user.isDemo && <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20">{tr('Save Changes', 'Guardar Alterações', 'Guardar Cambios')}</button>}
                        </div>
                    </form>
                </div>
            )}

            {/* Create Job Modal */}
            {showCreateJob && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleCreateJob} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-4">Create New Position</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Job Title</label>
                                <input required type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={newJobForm.title} onChange={e => setNewJobForm({...newJobForm, title: e.target.value})} placeholder="e.g. Senior Product Designer" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Required Skills (Comma separated)</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={newJobForm.skills} onChange={e => setNewJobForm({...newJobForm, skills: e.target.value})} placeholder="React, Node.js, UX" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Execution Areas (comma separated)</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={newJobForm.executionAreasText} onChange={e => setNewJobForm({...newJobForm, executionAreasText: e.target.value})} placeholder="Frontend, Product, Data" />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Work Type</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.workType}
                                    onChange={e => setNewJobForm({...newJobForm, workType: e.target.value as any})}
                                >
                                    <option value="Remote">Remote</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="On-site">On-site</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Geography</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={newJobForm.geography} onChange={e => setNewJobForm({...newJobForm, geography: e.target.value})} placeholder="Portugal, Spain, EU..." />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Contract Type</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.contractType}
                                    onChange={e => setNewJobForm({...newJobForm, contractType: e.target.value as any})}
                                >
                                    <option value="Full-time">Full-time</option>
                                    <option value="Part-time">Part-time</option>
                                    <option value="Contract">Contract</option>
                                    <option value="Freelance">Freelance</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Seniority</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.seniority}
                                    onChange={e => setNewJobForm({...newJobForm, seniority: e.target.value as any})}
                                >
                                    <option value="Junior">Junior</option>
                                    <option value="Mid">Mid</option>
                                    <option value="Senior">Senior</option>
                                    <option value="Lead">Lead</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Salary Min (year)</label>
                                <input type="number" min="0" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={newJobForm.salaryMin} onChange={e => setNewJobForm({...newJobForm, salaryMin: e.target.value})} />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Salary Max (year)</label>
                                <input type="number" min="0" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all" 
                                    value={newJobForm.salaryMax} onChange={e => setNewJobForm({...newJobForm, salaryMax: e.target.value})} />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">Interview Style</label>
                                <select className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.interviewStyle} 
                                    onChange={e => setNewJobForm({...newJobForm, interviewStyle: e.target.value as any})}
                                >
                                    <option value="Mixed">Mixed (Standard)</option>
                                    <option value="Technical">Technical Focus</option>
                                    <option value="Behavioral">Behavioral (STAR)</option>
                                    <option value="Casual">Casual / Culture Fit</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <label className="block text-zinc-400 text-sm mb-1">AI Tone (this job)</label>
                                <select
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.aiTone}
                                    onChange={e => setNewJobForm({ ...newJobForm, aiTone: e.target.value as any })}
                                >
                                    {['Professional', 'Friendly', 'Neutral', 'Energetic', 'Calm'].map(o => (
                                        <option key={o} value={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Job Description</label>
                                <textarea required className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24" 
                                    value={newJobForm.description} onChange={e => setNewJobForm({...newJobForm, description: e.target.value})} placeholder="Brief overview of the role..." />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Requirements</label>
                                <textarea required className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24" 
                                    value={newJobForm.requirements} onChange={e => setNewJobForm({...newJobForm, requirements: e.target.value})} placeholder="Detailed requirements used by AI to generate questions..." />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Required Languages (comma separated)</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.requiredLanguagesText}
                                    onChange={e => setNewJobForm({ ...newJobForm, requiredLanguagesText: e.target.value })}
                                    placeholder="English (C1), Portuguese (B2)"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Must-have Skills (comma separated)</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.mustHaveSkillsText}
                                    onChange={e => setNewJobForm({ ...newJobForm, mustHaveSkillsText: e.target.value })}
                                    placeholder="React, TypeScript, SQL"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Nice-to-have Skills (comma separated)</label>
                                <input type="text" className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={newJobForm.niceToHaveSkillsText}
                                    onChange={e => setNewJobForm({ ...newJobForm, niceToHaveSkillsText: e.target.value })}
                                    placeholder="Design Systems, Docker"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Priority Questions (one per line)</label>
                                <textarea
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24"
                                    value={newJobForm.priorityQuestionsText}
                                    onChange={e => setNewJobForm({ ...newJobForm, priorityQuestionsText: e.target.value })}
                                    placeholder="Example: Tell us about a project where you reduced production incidents."
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">
                                    Ranking Weights: Transcript {newJobForm.transcriptWeight}% / Video {100 - newJobForm.transcriptWeight}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={newJobForm.transcriptWeight}
                                    onChange={e => setNewJobForm({ ...newJobForm, transcriptWeight: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <p className="text-xs text-zinc-500 mt-2">Final ranking score uses these weights for this specific job.</p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                            <button type="button" onClick={() => setShowCreateJob(false)} className="text-zinc-400 hover:text-white px-4 py-2">{tr('Cancel', 'Cancelar', 'Cancelar')}</button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded">{tr('Create Listing', 'Criar Vaga', 'Crear Vacante')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Edit Existing Job AI Settings Modal */}
            {showEditJobAIModal && editingJob && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <form onSubmit={handleSaveJobAISettings} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-white mb-1">Edit AI Settings</h2>
                        <p className="text-sm text-zinc-500 mb-3">Job: {editingJob.title}</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">AI Tone (this job)</label>
                                <select
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none transition-all"
                                    value={editJobAIForm.aiTone}
                                    onChange={e => setEditJobAIForm({ ...editJobAIForm, aiTone: e.target.value as any })}
                                >
                                    {['Professional', 'Friendly', 'Neutral', 'Energetic', 'Calm'].map(o => (
                                        <option key={o} value={o}>{o}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">Priority Questions (one per line)</label>
                                <textarea
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24"
                                    value={editJobAIForm.priorityQuestionsText}
                                    onChange={e => setEditJobAIForm({ ...editJobAIForm, priorityQuestionsText: e.target.value })}
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-zinc-400 text-sm mb-1">
                                    Ranking Weights: Transcript {editJobAIForm.transcriptWeight}% / Video {100 - editJobAIForm.transcriptWeight}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={editJobAIForm.transcriptWeight}
                                    onChange={e => setEditJobAIForm({ ...editJobAIForm, transcriptWeight: parseInt(e.target.value) })}
                                    className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="flex items-center gap-2 text-sm text-zinc-300">
                                    <input
                                        type="checkbox"
                                        checked={editJobAIForm.applyToExistingApplications}
                                        onChange={e => setEditJobAIForm({ ...editJobAIForm, applyToExistingApplications: e.target.checked })}
                                        className="accent-blue-500"
                                    />
                                    Apply new weights to existing applications for this job
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                            <button type="button" onClick={() => { setShowEditJobAIModal(false); setEditingJob(null); }} className="text-zinc-400 hover:text-white px-4 py-2">
                                {tr('Cancel', 'Cancelar', 'Cancelar')}
                            </button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded">
                                Save AI Settings
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Job Listings */}
                <div className="lg:col-span-1 space-y-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
                            <BriefcaseIcon className="w-5 h-5"/> {tr('Active Jobs', 'Vagas Ativas', 'Vacantes Activas')}
                        </h3>
                        <button 
                            onClick={() => setSelectedJobId(null)} 
                            className={`text-xs px-2 py-1 rounded transition-colors ${!selectedJobId ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            View All
                        </button>
                    </div>
                    
                    <div className="space-y-3">
                        {jobs.map(job => (
                            <div key={job.id} 
                                onClick={() => setSelectedJobId(selectedJobId === job.id ? null : job.id)}
                                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${selectedJobId === job.id ? 'bg-zinc-800 border-blue-500 shadow-lg' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-600'}`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-bold transition-colors ${selectedJobId === job.id ? 'text-white' : 'text-zinc-200 group-hover:text-white'}`}>{job.title}</h4>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleOpenJobAISettings(job);
                                            }}
                                            className="text-[10px] uppercase font-mono text-blue-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-700 hover:border-blue-500"
                                        >
                                            AI
                                        </button>
                                        <span className="text-[10px] uppercase font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{job.interviewStyle || 'Standard'}</span>
                                    </div>
                                </div>
                                <p className="text-sm text-zinc-500 truncate mb-3">{job.description}</p>
                                
                                {/* Skills Tags */}
                                <div className="flex flex-wrap gap-1.5">
                                    {job.skills?.slice(0, 3).map((skill, i) => (
                                        <span key={i} className="text-[10px] px-1.5 py-0.5 bg-zinc-900/80 text-zinc-400 rounded border border-zinc-700/50">
                                            {skill}
                                        </span>
                                    ))}
                                    {(job.skills?.length || 0) > 3 && <span className="text-[10px] text-zinc-600">+{job.skills!.length - 3}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: Applicants */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                        <div>
                            <h3 className="text-lg font-medium text-zinc-300 flex items-center gap-2">
                                <UserGroupIcon className="w-5 h-5"/> {tr('Applicants', 'Candidatos', 'Candidatos')}
                                {selectedJobId && <span className="text-sm font-normal text-zinc-500 ml-2">({tr('Filtered by selected job', 'Filtrado pela vaga selecionada', 'Filtrado por vacante seleccionada')})</span>}
                            </h3>
                        </div>
                        
                        {/* Filters */}
                        <div className="flex items-center gap-2">
                            <FunnelIcon className="w-4 h-4 text-zinc-500" />
                            <select 
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                            >
                                <option value="all">{tr('All Candidates', 'Todos os Candidatos', 'Todos los Candidatos')}</option>
                                <option value="high_match">{tr('High Match (>80%)', 'Alta Compatibilidade (>80%)', 'Alta Compatibilidad (>80%)')}</option>
                                <option value="reviewed">{tr('Reviewed Only', 'Apenas Revistos', 'Solo Revisados')}</option>
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterExecutionLevel}
                                onChange={(e) => setFilterExecutionLevel(e.target.value as any)}
                            >
                                <option value="all">Exec: All</option>
                                <option value="high">Exec: High</option>
                                <option value="medium">Exec: Medium</option>
                                <option value="low">Exec: Low</option>
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateCountry}
                                onChange={(e) => setFilterCandidateCountry(e.target.value)}
                            >
                                <option value="all">Country: All</option>
                                {candidateCountries.map((country) => (
                                  <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateArea}
                                onChange={(e) => setFilterCandidateArea(e.target.value)}
                            >
                                <option value="all">Area: All</option>
                                {candidateAreas.map((area) => (
                                  <option key={area} value={area}>{area}</option>
                                ))}
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateSeniority}
                                onChange={(e) => setFilterCandidateSeniority(e.target.value as any)}
                            >
                                <option value="all">Seniority: All</option>
                                {candidateSeniorities.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateAvailability}
                                onChange={(e) => setFilterCandidateAvailability(e.target.value as any)}
                            >
                                <option value="all">Availability: All</option>
                                <option value="Immediate">Immediate</option>
                                <option value="2 Weeks">2 Weeks</option>
                                <option value="1 Month">1 Month</option>
                                <option value="2+ Months">2+ Months</option>
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateContractType}
                                onChange={(e) => setFilterCandidateContractType(e.target.value as any)}
                            >
                                <option value="all">Contract: All</option>
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Freelance">Freelance</option>
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateLanguage}
                                onChange={(e) => setFilterCandidateLanguage(e.target.value)}
                            >
                                <option value="all">Language: All</option>
                                {candidateLanguages.map((lang) => (
                                  <option key={lang} value={lang}>{lang}</option>
                                ))}
                            </select>
                            <select
                                className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                                value={filterCandidateSalary}
                                onChange={(e) => setFilterCandidateSalary(e.target.value as any)}
                            >
                                <option value="all">Salary: All</option>
                                <option value="within_budget">Within budget</option>
                                <option value="above_budget">Above budget</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {sortedApplications.map(app => (
                            <div key={app.id} 
                                onClick={() => handleViewApp(app)} 
                                className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl hover:border-zinc-600 cursor-pointer flex flex-col sm:flex-row justify-between items-center group transition-all hover:bg-zinc-800/50">
                                
                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors
                                        ${app.matchScore > 80 ? 'bg-green-900/30 text-green-400 border border-green-900' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'}`}>
                                        {app.applicantName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{app.applicantName}</h4>
                                        <div className="text-[10px] uppercase tracking-wider mt-1">
                                            <span className={`px-2 py-0.5 rounded-full border ${
                                                app.executionLevel === 'high'
                                                  ? 'text-green-400 border-green-700/60 bg-green-900/20'
                                                  : app.executionLevel === 'medium'
                                                  ? 'text-yellow-400 border-yellow-700/60 bg-yellow-900/20'
                                                  : 'text-red-400 border-red-700/60 bg-red-900/20'
                                            }`}>
                                                {(app.executionLevel || 'low').toUpperCase()} EXECUTION
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                            <ClockIcon className="w-3 h-3" />
                                            <span>Applied {new Date(app.timestamp).toLocaleDateString()}</span>
                                        </div>
                                        {app.aiResume?.summary && (
                                            <p className="text-xs text-zinc-400 mt-2 line-clamp-2 max-w-xl">{app.aiResume.summary}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right">
                                        <div className={`text-xl font-bold ${app.matchScore > 80 ? 'text-green-500' : app.matchScore > 60 ? 'text-yellow-500' : 'text-zinc-500'}`}>
                                            {app.matchScore}%
                                        </div>
                                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">{tr('Match Score', 'Pontuação', 'Puntuación')}</div>
                                    </div>
                                    <div className="h-8 w-px bg-zinc-800 hidden sm:block"></div>
                                    <div className="text-zinc-500 group-hover:text-white transition-colors">
                                        <ArrowUpTrayIcon className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {sortedApplications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
                                <MagnifyingGlassIcon className="w-10 h-10 mb-3 opacity-20" />
                                <p>{tr('No applicants found matching the current filters.', 'Sem candidatos para os filtros atuais.', 'No hay candidatos para los filtros actuales.')}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
        )}
      </div>
    );
  }

  // Applicant View
  return (
    <div className="min-h-[calc(100vh-64px)]">
    <DemoBanner />
    <div className="max-w-4xl mx-auto px-4 py-8">
        {renderApplicationModal()}
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{tr('Welcome,', 'Bem-vindo,', 'Bienvenido,')} {user.name}</h1>
            <p className="text-zinc-400">{tr('Manage your profile and find your next role.', 'Gira o seu perfil e encontre o seu próximo cargo.', 'Gestiona tu perfil y encuentra tu próximo puesto.')}</p>
        </div>

        {/* Resume Upload Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center text-blue-400">
                    <DocumentTextIcon className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">Your Resume</h3>
                    <p className="text-sm text-zinc-400">
                        {resumeFile 
                            ? `Uploaded: ${resumeFile.name}` 
                            : "Upload your CV to personalize your AI profile (Optional)"}
                    </p>
                </div>
            </div>
            <label className={`
                flex items-center gap-2 px-6 py-3 rounded-lg cursor-pointer transition-all font-medium text-sm
                ${resumeFile ? 'bg-zinc-800 text-white hover:bg-zinc-700' : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20'}
                ${user.isDemo ? 'opacity-50 cursor-not-allowed grayscale' : ''}
            `}>
                {user.isDemo ? <LockClosedIcon className="w-4 h-4"/> : <ArrowUpTrayIcon className="w-4 h-4" />}
                {resumeFile ? 'Update Resume' : 'Upload PDF/DOCX'}
                <input type="file" accept=".pdf,.docx,.doc" className="hidden" onChange={handleResumeUpload} disabled={!!user.isDemo} />
            </label>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-8 border-b border-zinc-800 mb-6">
           <button 
             onClick={() => setActiveTab('jobs')} 
             className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'jobs' ? 'text-white border-blue-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
           >
             Open Positions
           </button>
           <button 
             onClick={() => setActiveTab('applications')} 
             className={`pb-3 text-sm font-bold transition-all border-b-2 flex items-center gap-2 ${activeTab === 'applications' ? 'text-white border-blue-500' : 'text-zinc-500 border-transparent hover:text-zinc-300'}`}
           >
             My Applications
             {myApplications.length > 0 && (
                <span className="bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full text-xs">{myApplications.length}</span>
             )}
           </button>
        </div>

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
            <>
                <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 mb-4 flex flex-wrap gap-2">
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterWorkType}
                        onChange={(e) => setJobFilterWorkType(e.target.value as any)}
                    >
                        <option value="all">Work Type: All</option>
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterGeography}
                        onChange={(e) => setJobFilterGeography(e.target.value)}
                    >
                        <option value="all">Geography: All</option>
                        {availableGeographies.map((geo) => (
                          <option key={geo} value={geo}>{geo}</option>
                        ))}
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterArea}
                        onChange={(e) => setJobFilterArea(e.target.value)}
                    >
                        <option value="all">Area: All</option>
                        {availableAreas.map((area) => (
                          <option key={area} value={area}>{area}</option>
                        ))}
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterContractType}
                        onChange={(e) => setJobFilterContractType(e.target.value as any)}
                    >
                        <option value="all">Contract: All</option>
                        {availableContractTypes.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterSeniority}
                        onChange={(e) => setJobFilterSeniority(e.target.value as any)}
                    >
                        <option value="all">Seniority: All</option>
                        {availableSeniorities.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterAvailabilityFit}
                        onChange={(e) => setJobFilterAvailabilityFit(e.target.value as any)}
                    >
                        <option value="all">Availability: All</option>
                        <option value="quick">Quick Start (Immediate/2 Weeks)</option>
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterSalaryFit}
                        onChange={(e) => setJobFilterSalaryFit(e.target.value as any)}
                    >
                        <option value="all">Salary: All</option>
                        <option value="fit">Salary Fit</option>
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterLanguage}
                        onChange={(e) => setJobFilterLanguage(e.target.value)}
                    >
                        <option value="all">Language: All</option>
                        {availableLanguages.map((lang) => (
                          <option key={lang} value={lang}>{lang}</option>
                        ))}
                    </select>
                    <select
                        className="bg-zinc-800 text-sm text-zinc-300 border border-zinc-700 rounded-lg px-3 py-1.5 focus:border-blue-500 outline-none"
                        value={jobFilterMustHave}
                        onChange={(e) => setJobFilterMustHave(e.target.value)}
                    >
                        <option value="all">Must-have: All</option>
                        {availableMustHaves.map((skill) => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>
                </div>
                <div className="grid gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                    {filteredJobsForApplicant.map(job => {
                        const applied = hasApplied(job.id);
                        return (
                            <div key={job.id} className={`bg-zinc-900 border rounded-xl p-6 transition-all ${applied ? 'border-zinc-800 opacity-75' : 'border-zinc-800 hover:border-zinc-600 shadow-md'}`}>
                                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                            {job.title}
                                            {applied && <span className="bg-zinc-800 text-zinc-400 text-xs px-2 py-1 rounded border border-zinc-700">Applied</span>}
                                        </h3>
                                        <p className="text-sm text-blue-400 font-mono mt-1 mb-2">{job.companyId}</p>
                                        <p className="text-zinc-400 text-sm leading-relaxed max-w-2xl">{job.description}</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            <span className="text-[10px] px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">{job.workType || 'Hybrid'}</span>
                                            {job.geography && <span className="text-[10px] px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">{job.geography}</span>}
                                            {job.contractType && <span className="text-[10px] px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">{job.contractType}</span>}
                                            {job.seniority && <span className="text-[10px] px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">{job.seniority}</span>}
                                            {(job.salaryMin || job.salaryMax) && <span className="text-[10px] px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">€{job.salaryMin || 0} - €{job.salaryMax || 0}</span>}
                                            {(job.executionAreas || []).slice(0, 2).map((area, i) => (
                                                <span key={i} className="text-[10px] px-2 py-1 bg-zinc-800 text-zinc-300 rounded-full border border-zinc-700">{area}</span>
                                            ))}
                                        </div>
                                        
                                        {/* Skills for Applicant View */}
                                        <div className="flex flex-wrap gap-2 mt-3">
                                            {job.skills?.map((skill, i) => (
                                                <span key={i} className="text-xs px-2 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    {!applied && (
                                        <button 
                                            onClick={() => onStartInterview(job)}
                                            className="whitespace-nowrap bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-full font-bold text-sm transition-colors shadow-lg shadow-white/10 flex items-center gap-2"
                                        >
                                            <PlayCircleIcon className="w-5 h-5" />
                                            Start Interview
                                        </button>
                                    )}
                                </div>
                                <div className="bg-zinc-950/50 rounded p-4 border border-zinc-800/50">
                                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block mb-1">Requirements</span>
                                    <p className="text-sm text-zinc-300">{job.requirements}</p>
                                </div>
                            </div>
                        );
                    })}
                    {filteredJobsForApplicant.length === 0 && (
                        <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                            <p className="text-zinc-500">No positions match the selected filters.</p>
                        </div>
                    )}
                </div>
            </>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
            <div className="space-y-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
                {myApplications.map(app => {
                     const job = jobs.find(j => j.id === app.jobId);
                     return (
                        <div key={app.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-zinc-700 transition-colors">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-lg font-bold text-white">{job?.title || 'Unknown Role'}</h3>
                                    <span className="bg-green-900/30 text-green-400 border border-green-900/50 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckBadgeIcon className="w-3 h-3" />
                                        Interview Completed
                                    </span>
                                </div>
                                <p className="text-sm text-zinc-500 mb-3">Applied {new Date(app.timestamp).toLocaleDateString()}</p>
                                
                                <div className="flex items-center gap-4 text-xs font-mono">
                                    <div className="flex items-center gap-1 text-zinc-400">
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                        Resume Generated
                                    </div>
                                    <div className="flex items-center gap-1 text-zinc-400">
                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                        Pending Review
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <div className="text-2xl font-bold text-white">{app.matchScore}%</div>
                                    <div className="text-xs text-zinc-500 uppercase">Match Score</div>
                                </div>
                                <button 
                                    onClick={() => handleViewApp(app)}
                                    className="bg-zinc-800 hover:bg-zinc-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors border border-zinc-700 flex items-center gap-2"
                                >
                                    <DocumentTextIcon className="w-4 h-4" />
                                    View AI Profile
                                </button>
                            </div>
                        </div>
                     );
                })}
                {myApplications.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                        <BriefcaseIcon className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
                        <p className="text-zinc-500">You haven't submitted any applications yet.</p>
                        <button onClick={() => setActiveTab('jobs')} className="text-blue-500 hover:text-blue-400 text-sm mt-2 font-medium">Browse Open Roles</button>
                    </div>
                )}
            </div>
        )}
    </div>
    </div>
  );
};
