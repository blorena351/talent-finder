
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { 
    CheckIcon, 
    XMarkIcon, 
    BuildingOfficeIcon, 
    UserIcon, 
    SparklesIcon,
    QuestionMarkCircleIcon,
    ChevronDownIcon,
    ChevronUpIcon
} from '@heroicons/react/24/outline';

interface PricingProps {
    onBack: () => void;
    onLoginClick: () => void;
    onGetStarted: (role: 'company' | 'applicant') => void;
    onViewFeatures: () => void;
    onViewHowItWorks: () => void;
}

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-zinc-800 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
            >
                <span className="font-medium text-white group-hover:text-blue-400 transition-colors">{question}</span>
                {isOpen ? <ChevronUpIcon className="w-5 h-5 text-zinc-500" /> : <ChevronDownIcon className="w-5 h-5 text-zinc-500" />}
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
                <p className="text-zinc-400 text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    );
};

export const Pricing: React.FC<PricingProps> = ({ onBack, onLoginClick, onGetStarted, onViewFeatures, onViewHowItWorks }) => {
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

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
                        <button onClick={onViewFeatures} className="hover:text-white transition-colors">Features</button>
                        <button onClick={onViewHowItWorks} className="hover:text-white transition-colors">How it Works</button>
                        <button className="text-white transition-colors">Pricing</button>
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
            <section className="pt-32 pb-12 text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 text-xs font-medium border border-zinc-800 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>Transparent Pricing</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                        Simple Pricing for <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Every Hiring Need</span>
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        Choose the plan that fits your recruitment workflow. No hidden fees.
                    </p>
                </div>
            </section>

            {/* Billing Toggle */}
            <section className="pb-12 px-6 flex justify-center">
                <div className="bg-zinc-900 p-1 rounded-full border border-zinc-800 flex items-center relative">
                    <button 
                        onClick={() => setBillingCycle('monthly')}
                        className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Monthly
                    </button>
                    <button 
                        onClick={() => setBillingCycle('yearly')}
                        className={`relative z-10 px-6 py-2 rounded-full text-sm font-bold transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                        Yearly
                        <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-500/30">-20%</span>
                    </button>
                    
                    {/* Sliding Background */}
                    <div className={`absolute top-1 bottom-1 w-[50%] bg-zinc-800 rounded-full transition-all duration-300 ${billingCycle === 'monthly' ? 'left-1' : 'left-[49%]'}`}></div>
                </div>
            </section>

            {/* For Applicants Section */}
            <section className="pb-12 px-6">
                <div className="max-w-5xl mx-auto">
                     <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                        
                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                                <UserIcon className="w-8 h-8 text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">For Applicants</h3>
                                <p className="text-zinc-400">Join efficiently and get hired faster.</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                            <div className="flex gap-6 text-sm text-zinc-300">
                                <div className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-green-500" /> AI Interview Practice
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-green-500" /> Auto-Resume Gen
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckIcon className="w-4 h-4 text-green-500" /> Unlimited Applications
                                </div>
                            </div>
                            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>
                            <div className="text-center sm:text-right">
                                <div className="text-3xl font-bold text-white">Free</div>
                                <div className="text-xs text-zinc-500 uppercase">Forever</div>
                            </div>
                            <button 
                                onClick={() => onGetStarted('applicant')}
                                className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-full font-bold transition-colors shadow-lg shadow-white/5 whitespace-nowrap"
                            >
                                Start Free
                            </button>
                        </div>
                     </div>
                </div>
            </section>

            {/* Company Pricing Grid */}
            <section className="pb-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <h3 className="text-center text-zinc-500 font-bold uppercase tracking-widest text-sm mb-8">For Companies</h3>
                    
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        {/* Starter */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
                            <p className="text-sm text-zinc-500 mb-6">Perfect for small teams and startups.</p>
                            
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? '49' : '39'}</span>
                                <span className="text-zinc-500">/mo</span>
                                {billingCycle === 'yearly' && <p className="text-xs text-green-500 mt-1">Billed annually</p>}
                            </div>

                            <button 
                                onClick={() => onGetStarted('company')}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl border border-zinc-700 transition-colors mb-8"
                            >
                                Start Starter Plan
                            </button>

                            <ul className="space-y-4 text-sm text-zinc-400">
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>Up to <strong>15</strong> AI interviews/mo</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>Company Dashboard</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>Video Recordings & Transcripts</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>Basic Analytics</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>Email Support</span>
                                </li>
                            </ul>
                        </div>

                        {/* Professional */}
                        <div className="bg-zinc-900 border border-blue-500/50 rounded-2xl p-8 relative shadow-2xl shadow-blue-900/10 transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Most Popular
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                Professional <SparklesIcon className="w-4 h-4 text-blue-400" />
                            </h3>
                            <p className="text-sm text-zinc-500 mb-6">For growing HR teams scaling up.</p>
                            
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">${billingCycle === 'monthly' ? '149' : '119'}</span>
                                <span className="text-zinc-500">/mo</span>
                                {billingCycle === 'yearly' && <p className="text-xs text-green-500 mt-1">Billed annually</p>}
                            </div>

                            <button 
                                onClick={() => onGetStarted('company')}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-600/20 transition-colors mb-8"
                            >
                                Start Professional Plan
                            </button>

                            <ul className="space-y-4 text-sm text-zinc-300">
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" /> 
                                    <span>Up to <strong>75</strong> AI interviews/mo</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" /> 
                                    <span>Priority Queue Processing</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" /> 
                                    <span>Advanced Talent Analytics</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" /> 
                                    <span>Team Collaboration Tools</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-blue-400 shrink-0" /> 
                                    <span>Priority Support</span>
                                </li>
                            </ul>
                        </div>

                        {/* Enterprise */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-600 transition-colors">
                            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
                            <p className="text-sm text-zinc-500 mb-6">For large organizations with custom needs.</p>
                            
                            <div className="mb-6">
                                <span className="text-4xl font-bold text-white">Custom</span>
                            </div>

                            <button 
                                onClick={() => alert("Contact Sales Demo: sales@talentfinder.com")}
                                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 rounded-xl border border-zinc-700 transition-colors mb-8"
                            >
                                Contact Sales
                            </button>

                            <ul className="space-y-4 text-sm text-zinc-400">
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span><strong>Unlimited</strong> AI Interviews</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>Custom AI Interviewer Tuning</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>SLA + Dedicated Account Manager</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>ATS & HRIS Integrations</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <CheckIcon className="w-5 h-5 text-white shrink-0" /> 
                                    <span>White Label Options</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-zinc-900/30 border-t border-zinc-900">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <QuestionMarkCircleIcon className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2">Frequently Asked Questions</h2>
                        <p className="text-zinc-400">Everything you need to know about our billing and tiers.</p>
                    </div>

                    <div className="space-y-2">
                        <FaqItem 
                            question="How does billing work?" 
                            answer="We offer both monthly and yearly billing cycles. You are billed at the beginning of each cycle. If you exceed your interview limit, we'll notify you to upgrade or purchase add-on packs." 
                        />
                        <FaqItem 
                            question="Can I cancel anytime?" 
                            answer="Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period. There are no cancellation fees." 
                        />
                         <FaqItem 
                            question="Are video interviews stored securely?" 
                            answer="Absolutely. All video data is encrypted at rest and in transit. We comply with GDPR and CCPA regulations to ensure candidate privacy is protected." 
                        />
                        <FaqItem 
                            question="Do applicants have to pay?" 
                            answer="No. The platform is completely free for applicants to create profiles, take interviews, and generate their AI resumes." 
                        />
                        <FaqItem 
                            question="What happens if I need more interviews?" 
                            answer="You can easily upgrade to the next tier directly from your dashboard. For Enterprise needs, our sales team can create a custom package for unlimited volume." 
                        />
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
