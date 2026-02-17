/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState } from 'react';
import { Store, User } from '../services/store';
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  UserIcon,
  ExclamationCircleIcon,
  EnvelopeIcon,
  LockClosedIcon,
  SparklesIcon,
  PlayCircleIcon,
} from '@heroicons/react/24/outline';

interface AuthProps {
  onLogin: (user: User) => void;
  initialRole?: 'company' | 'applicant' | 'admin';
  onBack: () => void;
}

type AuthStep = 'SELECT_ROLE' | 'SIGNUP_FORM' | 'VERIFY_EMAIL' | 'ONBOARDING' | 'LOGIN_FORM';

export const Auth: React.FC<AuthProps> = ({ onLogin, initialRole, onBack }) => {
  const demoEnabled = import.meta.env.VITE_ENABLE_DEMO === 'true';
  const [step, setStep] = useState<AuthStep>(initialRole ? 'LOGIN_FORM' : 'SELECT_ROLE');
  const [role, setRole] = useState<'company' | 'applicant' | 'admin'>('applicant');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const [companyForm, setCompanyForm] = useState({
    companyName: '',
    website: '',
    size: '1-10',
    industry: '',
    country: '',
    contactPerson: '',
    contactPhone: '',
    description: '',
  });

  const [applicantForm, setApplicantForm] = useState({
    fullName: '',
    country: '',
    phone: '',
    linkedInUrl: '',
  });

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleRoleSelect = (selectedRole: 'company' | 'applicant') => {
    setRole(selectedRole);
    setStep('SIGNUP_FORM');
    setError(null);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) return setError('Invalid email address format.');
    if (password.length < 8) return setError('Password must be at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (role === 'admin') return setError('Admin registration is not allowed via this form.');

    setIsLoading(true);
    const result = await Store.register(email, password, role as 'company' | 'applicant');
    setIsLoading(false);

    if (result.success) {
      setStep('VERIFY_EMAIL');
    } else {
      setError(result.message || 'Registration failed.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    let result = await Store.login(email, password);
    if (!result.success) {
      const adminResult = await Store.adminLogin(email, password);
      if (adminResult.success) {
        result = adminResult;
      }
    }
    setIsLoading(false);

    if (result.success && result.user) {
      if (result.user.onboardingComplete || result.user.role === 'admin') {
        onLogin(result.user);
      } else {
        setRole(result.user.role);
        setStep('ONBOARDING');
      }
    } else {
      setError(result.message || 'Login failed.');
    }
  };

  const handleDemoLogin = async (demoRole: 'company' | 'applicant') => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const demoUser = Store.getDemoUser(demoRole);
    setIsLoading(false);

    if (demoUser) {
      onLogin(demoUser);
    } else {
      setError('Demo configuration missing. Enable VITE_ENABLE_DEMO=true to use demo accounts.');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    const success = await Store.verifyEmail(email, verificationCode);
    setIsLoading(false);

    if (success) {
      setStep('ONBOARDING');
    } else {
      setError('Invalid verification code.');
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const currentUser = Store.getCurrentUser();
    if (!currentUser) {
      setError('Session expired. Please log in again.');
      setStep('LOGIN_FORM');
      setIsLoading(false);
      return;
    }

    if (role === 'company') {
      if (!companyForm.companyName || !companyForm.contactPerson) {
        setError('Please fill in required fields.');
        setIsLoading(false);
        return;
      }
      await Store.saveCompanyProfile(currentUser.id, companyForm);
    } else {
      if (!applicantForm.fullName || !applicantForm.country) {
        setError('Please fill in required fields.');
        setIsLoading(false);
        return;
      }
      await Store.saveApplicantProfile(currentUser.id, applicantForm);
    }

    setIsLoading(false);
    const updatedUser = Store.getCurrentUser();
    if (updatedUser) onLogin(updatedUser);
  };

  const renderRoleSelection = () => (
    <div className="animate-in fade-in zoom-in duration-300 w-full max-w-2xl">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-4">Create your account</h1>
        <p className="text-zinc-400">Join Talent Finder today. Choose your path to get started.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <button
          onClick={() => handleRoleSelect('applicant')}
          className="group relative bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-blue-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-blue-900/10"
        >
          <div className="w-14 h-14 bg-blue-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <UserIcon className="w-8 h-8 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">I'm an Applicant</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Find your next role and complete AI-assisted interviews.</p>
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowLeftIcon className="w-5 h-5 text-blue-500 rotate-180" />
          </div>
        </button>

        <button
          onClick={() => handleRoleSelect('company')}
          className="group relative bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-purple-500/50 rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-2xl hover:shadow-purple-900/10"
        >
          <div className="w-14 h-14 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BuildingOfficeIcon className="w-8 h-8 text-purple-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">I'm a Company</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">Create jobs, run interviews, and shortlist faster.</p>
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowLeftIcon className="w-5 h-5 text-purple-500 rotate-180" />
          </div>
        </button>
      </div>

      <div className="text-center mt-12">
        <p className="text-zinc-500">
          Already have an account?{' '}
          <button onClick={() => setStep('LOGIN_FORM')} className="text-white font-medium hover:underline underline-offset-4">
            Log in here
          </button>
        </p>
      </div>
    </div>
  );

  const renderSignup = () => (
    <div className="w-full max-w-md animate-in slide-in-from-right-8 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Sign up as {role === 'company' ? 'Company' : 'Applicant'}</h2>
        <p className="text-zinc-400 text-sm">Create your credentials to continue.</p>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase">Email</label>
          <div className="relative">
            <input
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
            <EnvelopeIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
            />
            <LockClosedIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase">Confirm Password</label>
          <div className="relative">
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
            <LockClosedIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3.5" />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors mt-4 disabled:opacity-50">
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );

  const renderVerification = () => (
    <div className="w-full max-w-md animate-in slide-in-from-right-8 duration-300 text-center">
      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <EnvelopeIcon className="w-8 h-8 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
      <p className="text-zinc-400 mb-8">
        We sent a 6-digit code to <span className="text-white">{email}</span>.
      </p>

      <form onSubmit={handleVerify} className="space-y-6">
        <input
          type="text"
          maxLength={6}
          required
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-center text-2xl tracking-[0.5em] text-white focus:border-blue-500 outline-none transition-colors font-mono"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/[^0-9]/g, ''))}
          placeholder="000000"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button type="submit" disabled={isLoading || verificationCode.length !== 6} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
          {isLoading ? 'Verifying...' : 'Verify Email'}
        </button>
      </form>
    </div>
  );

  const renderOnboarding = () => (
    <div className="w-full max-w-2xl animate-in slide-in-from-right-8 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Complete your profile</h2>
        <p className="text-zinc-400">Tell us a bit more about {role === 'company' ? 'your company' : 'yourself'} to finish setup.</p>
      </div>

      <form onSubmit={handleOnboardingSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {role === 'company' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Company Name *</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.companyName}
                onChange={(e) => setCompanyForm({ ...companyForm, companyName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Website</label>
              <input
                type="url"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.website}
                onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                placeholder="https://"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Company Size</label>
              <select
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.size}
                onChange={(e) => setCompanyForm({ ...companyForm, size: e.target.value })}
              >
                <option>1-10</option>
                <option>11-50</option>
                <option>51-200</option>
                <option>200+</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Industry</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.industry}
                onChange={(e) => setCompanyForm({ ...companyForm, industry: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Country</label>
              <input
                type="text"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.country}
                onChange={(e) => setCompanyForm({ ...companyForm, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Contact Person *</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.contactPerson}
                onChange={(e) => setCompanyForm({ ...companyForm, contactPerson: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Phone</label>
              <input
                type="tel"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={companyForm.contactPhone}
                onChange={(e) => setCompanyForm({ ...companyForm, contactPhone: e.target.value })}
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Full Name *</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={applicantForm.fullName}
                onChange={(e) => setApplicantForm({ ...applicantForm, fullName: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Country *</label>
              <input
                type="text"
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={applicantForm.country}
                onChange={(e) => setApplicantForm({ ...applicantForm, country: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">Phone</label>
              <input
                type="tel"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={applicantForm.phone}
                onChange={(e) => setApplicantForm({ ...applicantForm, phone: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-medium text-zinc-400 uppercase mb-1">LinkedIn URL</label>
              <input
                type="url"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                value={applicantForm.linkedInUrl}
                onChange={(e) => setApplicantForm({ ...applicantForm, linkedInUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        )}

        <button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-lg transition-colors mt-6 disabled:opacity-50">
          {isLoading ? 'Saving Profile...' : 'Complete Setup'}
        </button>
      </form>
    </div>
  );

  const renderLogin = () => (
    <div className="w-full max-w-md animate-in slide-in-from-left-8 duration-300">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-zinc-400 text-sm">Log in to access your dashboard.</p>
      </div>

      <form onSubmit={handleLoginSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
            <ExclamationCircleIcon className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase">Email</label>
          <div className="relative">
            <input
              type="email"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <EnvelopeIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3.5" />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-zinc-400 uppercase">Password</label>
          <div className="relative">
            <input
              type="password"
              required
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg pl-10 pr-4 py-3 text-white focus:border-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <LockClosedIcon className="w-5 h-5 text-zinc-500 absolute left-3 top-3.5" />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full bg-white hover:bg-zinc-200 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50">
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-zinc-500">
          Don't have an account?{' '}
          <button onClick={() => setStep('SELECT_ROLE')} className="text-blue-400 hover:text-blue-300 font-medium hover:underline">
            Sign up
          </button>
        </p>
      </div>

      {demoEnabled && (
        <>
          <div className="mt-10 pt-10 border-t border-zinc-800/50">
            <div className="flex items-center justify-center gap-2 mb-6">
              <SparklesIcon className="w-5 h-5 text-yellow-500" />
              <h3 className="text-white font-bold tracking-tight">Try a Live Demo</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => handleDemoLogin('company')}
                className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl text-left transition-all hover:shadow-lg"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2 mb-2">
                  <BuildingOfficeIcon className="w-5 h-5 text-purple-500" />
                  <span className="font-bold text-white text-sm">Company Demo</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400">
                  Explore the HR dashboard, interview data, and applicant management.
                </p>
              </button>

              <button
                onClick={() => handleDemoLogin('applicant')}
                className="group bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 p-4 rounded-xl text-left transition-all hover:shadow-lg"
                disabled={isLoading}
              >
                <div className="flex items-center gap-2 mb-2">
                  <PlayCircleIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-white text-sm">Applicant Demo</span>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed group-hover:text-zinc-400">
                  Try the AI interview experience and candidate dashboard.
                </p>
              </button>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button onClick={() => { setEmail('admin@talentfinder.com'); setPassword('password123'); }} className="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">
              System Admin Login
            </button>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {step !== 'SELECT_ROLE' && step !== 'LOGIN_FORM' && (
          <button onClick={onBack} className="absolute top-0 left-0 md:left-10 text-zinc-500 hover:text-white flex items-center gap-2 text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Back
          </button>
        )}

        {step === 'LOGIN_FORM' && (
          <button onClick={onBack} className="absolute top-0 left-0 md:left-10 text-zinc-500 hover:text-white flex items-center gap-2 text-sm">
            <ArrowLeftIcon className="w-4 h-4" /> Home
          </button>
        )}

        {step === 'SELECT_ROLE' && renderRoleSelection()}
        {step === 'SIGNUP_FORM' && renderSignup()}
        {step === 'VERIFY_EMAIL' && renderVerification()}
        {step === 'ONBOARDING' && renderOnboarding()}
        {step === 'LOGIN_FORM' && renderLogin()}
      </div>
    </div>
  );
};
