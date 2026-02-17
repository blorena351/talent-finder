/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { User, Job, Application, Store } from '../services/store';
import { PlusIcon, BriefcaseIcon, UserGroupIcon, VideoCameraIcon, DocumentTextIcon, CheckBadgeIcon, ArrowUpTrayIcon, ClockIcon, PlayCircleIcon, FunnelIcon, MagnifyingGlassIcon, BuildingOfficeIcon, SparklesIcon, LockClosedIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { AdminDashboard } from './AdminDashboard';
import { CompanySettings } from './CompanySettings';

interface DashboardProps {
  user: User;
  onStartInterview: (job: Job) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onStartInterview }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [myApplications, setMyApplications] = useState<Application[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [showCreateJob, setShowCreateJob] = useState(false);
  const [newJobForm, setNewJobForm] = useState<{
    title: string;
    description: string;
    requirements: string;
    skills: string;
    interviewStyle: 'Technical' | 'Behavioral' | 'Mixed' | 'Casual';
  }>({ 
    title: '', 
    description: '', 
    requirements: '', 
    skills: '',
    interviewStyle: 'Mixed'
  });
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  
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
  
  // Applicant specific state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<'jobs' | 'applications'>('jobs');

  useEffect(() => {
    refreshData();
  }, [user]);

  const refreshData = () => {
    const allJobs = Store.getJobs();
    setJobs(allJobs);
    const allApps = Store.getApplications();
    
    if (user.role === 'company') {
      // Filter for company's jobs
      const companyApps = allApps.filter(app => {
        const job = allJobs.find(j => j.id === app.jobId);
        return job?.companyId === user.id;
      });
      setApplications(companyApps);
    } else if (user.role === 'applicant') {
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
    await Store.createJob({ 
        ...newJobForm, 
        skills: newJobForm.skills.split(',').map(s => s.trim()).filter(s => s),
        companyId: user.id 
    });
    setShowCreateJob(false);
    setNewJobForm({ title: '', description: '', requirements: '', skills: '', interviewStyle: 'Mixed' });
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
  const filteredApplications = applications.filter(app => {
    const matchesJob = !selectedJobId || app.jobId === selectedJobId;
    const matchesStatus = 
        filterStatus === 'all' ? true :
        filterStatus === 'high_match' ? app.matchScore >= 80 :
        filterStatus === 'reviewed' ? app.status === 'reviewed' : true;
    return matchesJob && matchesStatus;
  });

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
              You are viewing a demo version. Some features (saving, uploading) are limited.
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
                    <h1 className="text-2xl font-bold text-white">Company Dashboard</h1>
                    <p className="text-zinc-400">Manage jobs, review talent, and analyze interviews.</p>
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
                        <PlusIcon className="w-5 h-5" /> Post New Job
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
                                Manage Profile
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
                            <button type="button" onClick={() => setShowProfileModal(false)} className="text-zinc-400 hover:text-white px-4 py-2">Cancel</button>
                            {!user.isDemo && <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-blue-500/20">Save Changes</button>}
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
                        </div>
                        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                            <button type="button" onClick={() => setShowCreateJob(false)} className="text-zinc-400 hover:text-white px-4 py-2">Cancel</button>
                            <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded">Create Listing</button>
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
                            <BriefcaseIcon className="w-5 h-5"/> Active Jobs
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
                                    <span className="text-[10px] uppercase font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">{job.interviewStyle || 'Standard'}</span>
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
                                <UserGroupIcon className="w-5 h-5"/> Applicants
                                {selectedJobId && <span className="text-sm font-normal text-zinc-500 ml-2">(Filtered by selected job)</span>}
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
                                <option value="all">All Candidates</option>
                                <option value="high_match">High Match (&gt;80%)</option>
                                <option value="reviewed">Reviewed Only</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        {filteredApplications.map(app => (
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
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                            <ClockIcon className="w-3 h-3" />
                                            <span>Applied {new Date(app.timestamp).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                                    <div className="text-right">
                                        <div className={`text-xl font-bold ${app.matchScore > 80 ? 'text-green-500' : app.matchScore > 60 ? 'text-yellow-500' : 'text-zinc-500'}`}>
                                            {app.matchScore}%
                                        </div>
                                        <div className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">Match Score</div>
                                    </div>
                                    <div className="h-8 w-px bg-zinc-800 hidden sm:block"></div>
                                    <div className="text-zinc-500 group-hover:text-white transition-colors">
                                        <ArrowUpTrayIcon className="w-5 h-5 rotate-90" />
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {filteredApplications.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800 text-zinc-500">
                                <MagnifyingGlassIcon className="w-10 h-10 mb-3 opacity-20" />
                                <p>No applicants found matching the current filters.</p>
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
            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {user.name}</h1>
            <p className="text-zinc-400">Manage your profile and find your next role.</p>
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
            <div className="grid gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
                {jobs.map(job => {
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
                {jobs.length === 0 && (
                    <div className="text-center py-20 bg-zinc-900/30 rounded-xl border border-dashed border-zinc-800">
                        <p className="text-zinc-500">No open positions available right now.</p>
                    </div>
                )}
            </div>
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
