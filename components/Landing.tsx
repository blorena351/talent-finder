
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
    VideoCameraIcon, 
    DocumentCheckIcon, 
    SparklesIcon, 
    BuildingOfficeIcon, 
    UserIcon, 
    ShieldCheckIcon,
    ArrowRightIcon,
    CpuChipIcon,
    DocumentArrowUpIcon
} from '@heroicons/react/24/outline';

interface LandingProps {
    onLoginClick: () => void;
    onGetStarted: (role: 'company' | 'applicant') => void;
    onViewFeatures: () => void;
    onViewHowItWorks: () => void;
    onViewPricing: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onGetStarted, onViewFeatures, onViewHowItWorks, onViewPricing }) => {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">T</div>
                        <span className="font-bold text-lg tracking-tight">Talent Finder</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <button onClick={onViewFeatures} className="hover:text-white transition-colors">Features</button>
                        <button onClick={onViewHowItWorks} className="hover:text-white transition-colors">How it Works</button>
                        <button onClick={onViewPricing} className="hover:text-white transition-colors">Pricing</button>
                    </div>

                    <button 
                        onClick={onLoginClick}
                        className="text-sm font-medium text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors border border-zinc-700"
                    >
                        Log In
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950/0 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <SparklesIcon className="w-3 h-3" />
                        <span>The Future of Recruitment is Here</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        AI Interviews. <br className="hidden md:block" />
                        <span className="text-white">Smart Hiring.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        Automated video interviews, real-time behavioral analysis, and instant resume generation. 
                        Talent Finder connects top talent with companies faster than ever.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <button 
                            onClick={() => onGetStarted('company')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 group"
                        >
                            <BuildingOfficeIcon className="w-5 h-5" />
                            I'm a Company
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => onGetStarted('applicant')}
                            className="w-full sm:w-auto px-8 py-4 bg-zinc-900 text-white font-bold rounded-full border border-zinc-800 hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                        >
                            <UserIcon className="w-5 h-5" />
                            I'm an Applicant
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works Teaser (Clickable) */}
            <section className="py-24 border-t border-zinc-900 bg-zinc-950/50 cursor-pointer hover:bg-zinc-900/30 transition-colors" onClick={onViewHowItWorks}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-zinc-400 flex items-center justify-center gap-2">
                            Three simple steps to your next opportunity.
                            <ArrowRightIcon className="w-4 h-4" />
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: DocumentArrowUpIcon,
                                title: "1. Upload or Create",
                                desc: "Applicants upload resumes. Companies post detailed job requirements."
                            },
                            {
                                icon: VideoCameraIcon,
                                title: "2. AI Interview",
                                desc: "Candidates answer dynamic, role-specific questions via video. AI records & transcribes."
                            },
                            {
                                icon: DocumentCheckIcon,
                                title: "3. Smart Analysis",
                                desc: "Get an instant AI-generated resume, skill score, and behavioral profile."
                            }
                        ].map((step, i) => (
                            <div key={i} className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 relative group">
                                <div className="absolute -top-6 left-8 bg-zinc-950 p-4 rounded-xl border border-zinc-800 group-hover:border-blue-500/50 transition-colors shadow-xl">
                                    <step.icon className="w-8 h-8 text-blue-500" />
                                </div>
                                <h3 className="text-xl font-bold mt-8 mb-3">{step.title}</h3>
                                <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid Teaser */}
            <section id="features" className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mb-16 flex justify-between items-end">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Powered by Advanced AI</h2>
                            <p className="text-zinc-400 max-w-xl">Leveraging Gemini 2.5 and 3.0 Pro models to understand context, tone, and technical accuracy.</p>
                        </div>
                        <button onClick={onViewFeatures} className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            View All Features <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl border border-zinc-800">
                            <CpuChipIcon className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-2">Adaptive Questioning</h3>
                            <p className="text-zinc-400">The AI doesn't just read a script. It generates questions based on the specific job description and skills required, ensuring every interview is relevant.</p>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                            <VideoCameraIcon className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold mb-2">Video Analysis</h3>
                            <p className="text-zinc-400">Records and analyzes video for soft skills, confidence, and clarity.</p>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                            <DocumentCheckIcon className="w-10 h-10 text-green-500 mb-6" />
                            <h3 className="text-xl font-bold mb-2">Auto-Resume</h3>
                            <p className="text-zinc-400">Generates a formatted, professional Markdown resume based on interview performance.</p>
                        </div>
                        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <ShieldCheckIcon className="w-10 h-10 text-orange-500 mb-6" />
                                <h3 className="text-2xl font-bold mb-2">Enterprise Grade Dashboard</h3>
                                <p className="text-zinc-400">Centralized hubs for both applicants and companies to track progress, view scores, and manage data securely.</p>
                            </div>
                             <div className="shrink-0">
                                <button onClick={onViewFeatures} className="text-sm font-bold border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full transition-colors">
                                    Explore Features
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Split Roles Section */}
            <section className="py-0">
                <div className="grid md:grid-cols-2">
                    {/* Companies */}
                    <div className="bg-zinc-900 px-8 py-20 lg:px-20 border-r border-zinc-800 flex flex-col justify-center">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6">
                            <BuildingOfficeIcon className="w-6 h-6 text-white" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">For Companies</h2>
                        <ul className="space-y-4 mb-8 text-zinc-400">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Screen hundreds of candidates in minutes
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Objective, AI-driven scoring
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                Consistent interview experience
                            </li>
                        </ul>
                        <button 
                            onClick={() => onGetStarted('company')}
                            className="self-start text-sm font-bold text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors"
                        >
                            Create Company Account
                        </button>
                    </div>

                    {/* Applicants */}
                    <div className="bg-black px-8 py-20 lg:px-20 flex flex-col justify-center">
                         <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                            <UserIcon className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">For Applicants</h2>
                        <ul className="space-y-4 mb-8 text-zinc-400">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                Practice interviews with real-time feedback
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                Get an AI-enhanced resume automatically
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                Apply to multiple jobs with one profile
                            </li>
                        </ul>
                        <button 
                             onClick={() => onGetStarted('applicant')}
                            className="self-start text-sm font-bold text-white border-b border-purple-500 pb-1 hover:text-purple-400 transition-colors"
                        >
                            Create Applicant Account
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-zinc-950 border-t border-zinc-900 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center font-bold text-xs text-white">T</div>
                        <span className="font-bold text-zinc-300">Talent Finder</span>
                    </div>
                    <div className="flex gap-8 text-sm text-zinc-500">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                        <a href="#" className="hover:text-white">Contact Support</a>
                    </div>
                    <div className="text-xs text-zinc-600">
                        Powered by Google AI
                    </div>
                </div>
            </footer>
        </div>
    );
};
