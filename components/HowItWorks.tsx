
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
    UserIcon, 
    DocumentArrowUpIcon, 
    VideoCameraIcon, 
    SparklesIcon, 
    ChartBarIcon,
    BuildingOfficeIcon, 
    Cog6ToothIcon, 
    ChatBubbleLeftRightIcon, 
    PresentationChartLineIcon, 
    UserGroupIcon, 
    CheckIcon
} from '@heroicons/react/24/outline';

interface HowItWorksProps {
    onBack: () => void;
    onLoginClick: () => void;
    onGetStarted: (role: 'company' | 'applicant') => void;
    onViewPricing: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onLoginClick, onGetStarted, onViewPricing }) => {
    const [activeTab, setActiveTab] = useState<'applicant' | 'company'>('applicant');

    const applicantSteps = [
        {
            title: "Create Your Account",
            desc: "Sign up instantly with email or Google. Build your basic profile in seconds.",
            icon: UserIcon
        },
        {
            title: "Upload Your CV (Optional)",
            desc: "Upload an existing resume for analysis, or skip this step and let our AI build one for you later.",
            icon: DocumentArrowUpIcon
        },
        {
            title: "Start AI Video Interview",
            desc: "Answer dynamic, role-specific questions on camera. The AI records and transcribes your responses in real-time.",
            icon: VideoCameraIcon
        },
        {
            title: "See Your AI-Generated Resume",
            desc: "Receive a professional Markdown resume, skill map, and personality summary based on your performance.",
            icon: SparklesIcon
        },
        {
            title: "Track Your Progress",
            desc: "Use your dashboard to manage applications, view match scores, and apply to new roles.",
            icon: ChartBarIcon
        }
    ];

    const companySteps = [
        {
            title: "Create Company Account",
            desc: "Set up your organization profile, industry details, and branding.",
            icon: BuildingOfficeIcon
        },
        {
            title: "Configure Interview Settings",
            desc: "Post jobs and define requirements. The AI automatically generates a question bank tailored to the role.",
            icon: Cog6ToothIcon
        },
        {
            title: "AI Interviews Applicants",
            desc: "The system conducts video interviews 24/7, ensuring consistent questioning for every candidate.",
            icon: ChatBubbleLeftRightIcon
        },
        {
            title: "Review Candidates",
            desc: "Watch video highlights, read transcripts, and view AI-calculated match scores and generated resumes.",
            icon: PresentationChartLineIcon
        },
        {
            title: "Manage Talent Pipeline",
            desc: "Shortlist top performers, export data, and streamline your hiring decision process.",
            icon: UserGroupIcon
        }
    ];

    const steps = activeTab === 'applicant' ? applicantSteps : companySteps;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-blue-500/30">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-zinc-950/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">T</div>
                        <span className="font-bold text-lg tracking-tight">Talent Finder</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <button onClick={onBack} className="hover:text-white transition-colors">Home</button>
                        <button className="text-white transition-colors">How it Works</button>
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
            <section className="pt-32 pb-16 text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 text-xs font-medium border border-zinc-800 mb-6 animate-in fade-in zoom-in duration-700">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span>Seamless Workflow</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        How It Works
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        From interview to insight — here’s how our AI transforms the hiring experience for everyone involved.
                    </p>
                </div>
            </section>

            {/* Toggle Switch */}
            <section className="pb-12 px-6 sticky top-16 z-40 bg-zinc-950/95 backdrop-blur-sm py-4 border-b border-white/5 md:border-none md:bg-transparent md:static">
                <div className="flex justify-center">
                    <div className="bg-zinc-900 p-1.5 rounded-full border border-zinc-800 flex relative">
                        {/* Sliding Background */}
                        <div 
                            className={`absolute top-1.5 bottom-1.5 rounded-full bg-zinc-800 transition-all duration-300 ease-out shadow-sm ${activeTab === 'applicant' ? 'left-1.5 w-[140px]' : 'left-[146px] w-[140px]'}`}
                        ></div>
                        
                        <button 
                            onClick={() => setActiveTab('applicant')}
                            className={`relative w-[140px] py-2.5 rounded-full text-sm font-bold transition-colors z-10 flex items-center justify-center gap-2 ${activeTab === 'applicant' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <UserIcon className="w-4 h-4" />
                            For Applicants
                        </button>
                        <button 
                            onClick={() => setActiveTab('company')}
                            className={`relative w-[140px] py-2.5 rounded-full text-sm font-bold transition-colors z-10 flex items-center justify-center gap-2 ${activeTab === 'company' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                        >
                            <BuildingOfficeIcon className="w-4 h-4" />
                            For Companies
                        </button>
                    </div>
                </div>
            </section>

            {/* Timeline Steps */}
            <section className="py-12 max-w-5xl mx-auto px-6">
                <div className="relative">
                    {/* Vertical Line (Desktop) */}
                    <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-zinc-800 hidden md:block"></div>
                    
                    {/* Vertical Line (Mobile) */}
                    <div className="absolute left-6 top-0 bottom-0 w-px bg-zinc-800 md:hidden"></div>

                    <div className="space-y-12 md:space-y-24">
                        {steps.map((step, index) => (
                            <div key={index} className={`relative flex flex-col md:flex-row gap-8 md:gap-0 items-start md:items-center animate-in fade-in slide-in-from-bottom-8 duration-700 delay-${index * 100}`}>
                                
                                {/* Step Number / Icon Container */}
                                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center z-10">
                                    <div className={`w-12 h-12 rounded-full border-4 border-zinc-950 flex items-center justify-center shadow-xl ${activeTab === 'applicant' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                                        <step.icon className="w-6 h-6 text-white" />
                                    </div>
                                </div>

                                {/* Content Left */}
                                <div className={`ml-16 md:ml-0 md:w-1/2 md:pr-16 text-left md:text-right ${index % 2 === 0 ? 'md:order-1' : 'md:order-2 md:pl-16 md:text-left'}`}>
                                    <div className={`${index % 2 !== 0 ? 'hidden md:block' : ''}`}>
                                        <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded mb-3 text-xs font-mono text-zinc-500">
                                            STEP 0{index + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                        <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>

                                {/* Content Right (For alternating layout on desktop) */}
                                <div className={`ml-16 md:ml-0 md:w-1/2 md:pl-16 text-left ${index % 2 === 0 ? 'md:order-2' : 'md:order-1 md:pr-16 md:text-right'}`}>
                                     <div className={`${index % 2 === 0 ? 'hidden md:block' : ''}`}>
                                        <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded mb-3 text-xs font-mono text-zinc-500">
                                            STEP 0{index + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                        <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                    
                                    {/* Mobile Only Content Duplicate */}
                                    <div className="md:hidden">
                                        <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded mb-3 text-xs font-mono text-zinc-500">
                                            STEP 0{index + 1}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                                        <p className="text-zinc-400 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-zinc-900 mt-12 bg-zinc-900/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
                    <p className="text-zinc-400 mb-8 text-lg">
                        {activeTab === 'applicant' 
                            ? "Join thousands of professionals landing their dream jobs."
                            : "Streamline your hiring process and find top talent faster."
                        }
                    </p>
                    <button 
                        onClick={() => onGetStarted(activeTab)}
                        className={`px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 mx-auto ${activeTab === 'applicant' ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                    >
                        <CheckIcon className="w-5 h-5" />
                        {activeTab === 'applicant' ? "Create Applicant Account" : "Create Company Account"}
                    </button>
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
