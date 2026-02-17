
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
    VideoCameraIcon, 
    DocumentMagnifyingGlassIcon, 
    SparklesIcon, 
    UserIcon, 
    BuildingOfficeIcon, 
    ShieldCheckIcon,
    ChatBubbleLeftRightIcon,
    PresentationChartLineIcon,
    LockClosedIcon,
    DocumentTextIcon,
    ArrowRightIcon
} from '@heroicons/react/24/outline';

interface FeaturesProps {
    onBack: () => void;
    onLoginClick: () => void;
    onGetStarted: () => void;
    onViewHowItWorks: () => void;
    onViewPricing: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onBack, onLoginClick, onGetStarted, onViewHowItWorks, onViewPricing }) => {
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
                        <button className="text-white transition-colors">Features</button>
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

            {/* Hero Banner */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 text-xs font-medium border border-zinc-800 mb-8 animate-in fade-in zoom-in duration-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>v2.0 Now Live</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
                        Powerful AI Features <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">That Transform Hiring</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        Discover everything our platform offers to simplify recruitment and help applicants shine. 
                        From intelligent interviews to automated paperwork.
                    </p>
                </div>
            </section>

            {/* Main Features Grid */}
            <section className="py-12 md:py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        
                        {/* A. AI Interviewer */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-blue-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ChatBubbleLeftRightIcon className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">AI Interviewer</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <VideoCameraIcon className="w-5 h-5 text-blue-500/70 shrink-0" />
                                    <span>Real-time conversational AI adapts to candidate answers.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-blue-500/70 shrink-0 mt-0.5" />
                                    <span>Generates adaptive follow-up questions.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-blue-500/70 shrink-0 mt-0.5" />
                                    <span>Full video recording & automated transcripts.</span>
                                </li>
                            </ul>
                        </div>

                        {/* B. Smart CV */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <DocumentMagnifyingGlassIcon className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Smart CV Analyzer</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-purple-500/70 shrink-0 mt-0.5" />
                                    <span>Extracts key skills, experience, and education instantly.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-purple-500/70 shrink-0 mt-0.5" />
                                    <span>Generates summaries and categorizes talent.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-purple-500/70 shrink-0" />
                                    <span>Works with PDF, DOCX, or starts from scratch.</span>
                                </li>
                            </ul>
                        </div>

                        {/* C. Auto Resume */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-green-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <SparklesIcon className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Auto-Resume Gen</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                                    <span>AI-crafted professional Markdown resumes.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                                    <span>Includes personality profile & strengths overview.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                                    <span>Calculates objective Job Match Scores.</span>
                                </li>
                            </ul>
                        </div>

                        {/* D. Candidate Dashboard */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-pink-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <UserIcon className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Candidate Dashboard</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                                    <span>Track interview status and history.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                                    <span>View and download AI-generated resumes.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                                    <span>Manage profile and applications in one place.</span>
                                </li>
                            </ul>
                        </div>

                        {/* E. Company Dashboard */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-orange-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <PresentationChartLineIcon className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Company Dashboard</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <BuildingOfficeIcon className="w-5 h-5 text-orange-500/70 shrink-0" />
                                    <span>Create and manage detailed job positions.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-orange-500/70 shrink-0 mt-0.5" />
                                    <span>Watch video recordings & read transcripts.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-orange-500/70 shrink-0 mt-0.5" />
                                    <span>Advanced filtering, scoring, and talent insights.</span>
                                </li>
                            </ul>
                        </div>

                         {/* F. Privacy & Security */}
                         <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-teal-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheckIcon className="w-6 h-6 text-teal-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">Privacy & Security</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <LockClosedIcon className="w-5 h-5 text-teal-500/70 shrink-0" />
                                    <span>GDPR compliant data processing.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-teal-500/70 shrink-0 mt-0.5" />
                                    <span>Secure cloud file storage.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-teal-500/70 shrink-0 mt-0.5" />
                                    <span>Encrypted video management.</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-zinc-900 bg-zinc-900/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Ready to transform your process?</h2>
                    <p className="text-zinc-400 mb-8 text-lg">Join thousands of companies and applicants using AI to find the perfect match.</p>
                    <button 
                        onClick={onGetStarted}
                        className="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-white/5"
                    >
                        Get Started Now
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
