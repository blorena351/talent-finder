/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Store, User, AnalyticsData, AIPrompts, SystemSettings } from '../services/store';
import { 
    UsersIcon, 
    BuildingOfficeIcon, 
    CpuChipIcon, 
    Cog6ToothIcon, 
    ChartBarIcon,
    CurrencyDollarIcon,
    ServerIcon,
    NoSymbolIcon,
    CheckCircleIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';

export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'companies' | 'applicants' | 'ai' | 'settings'>('overview');
    const [users, setUsers] = useState<User[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [prompts, setPrompts] = useState<AIPrompts | null>(null);
    const [settings, setSettings] = useState<SystemSettings | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const remoteUsers = await Store.getAdminUsers();
        setUsers(remoteUsers.length > 0 ? remoteUsers : Store.getUsers());
        setAnalytics(Store.getAnalytics());
        setPrompts(Store.getPrompts());
        setSettings(Store.getSettings());
    };

    const handleSavePrompts = (e: React.FormEvent) => {
        e.preventDefault();
        if (prompts) {
            setIsLoading(true);
            Store.savePrompts(prompts);
            setTimeout(() => setIsLoading(false), 500);
        }
    };

    const handleSaveSettings = () => {
        if (settings) {
            Store.saveSettings(settings);
            loadData(); // refresh
        }
    };

    const toggleUserStatus = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
        const updated = await Store.updateAdminUserStatus(userId, newStatus);
        if (updated) {
            await loadData();
            return;
        }
        Store.updateUserStatus(userId, newStatus);
        setUsers(Store.getUsers());
    };

    if (!analytics || !prompts || !settings) return <div>Loading Admin...</div>;

    const companies = users.filter(u => u.role === 'company');
    const applicants = users.filter(u => u.role === 'applicant');

    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
                <nav className="flex-1 p-4 space-y-1">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'overview' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                        <ChartBarIcon className="w-5 h-5" /> Overview
                    </button>
                    <button 
                        onClick={() => setActiveTab('companies')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'companies' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                        <BuildingOfficeIcon className="w-5 h-5" /> Companies
                    </button>
                    <button 
                        onClick={() => setActiveTab('applicants')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'applicants' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                        <UsersIcon className="w-5 h-5" /> Applicants
                    </button>
                    <div className="pt-4 pb-2">
                        <p className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">System</p>
                    </div>
                    <button 
                        onClick={() => setActiveTab('ai')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'ai' ? 'bg-purple-600/10 text-purple-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                        <CpuChipIcon className="w-5 h-5" /> AI Models & Prompts
                    </button>
                    <button 
                        onClick={() => setActiveTab('settings')}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'settings' ? 'bg-blue-600/10 text-blue-400' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                        <Cog6ToothIcon className="w-5 h-5" /> Settings
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto bg-black p-8">
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-white mb-6">System Overview</h2>
                        
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><UsersIcon className="w-6 h-6"/></div>
                                    <span className="text-xs text-zinc-500 font-mono">+12%</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white">{analytics.totalUsers}</h3>
                                <p className="text-sm text-zinc-500">Total Users</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-green-500/10 rounded-lg text-green-400"><CurrencyDollarIcon className="w-6 h-6"/></div>
                                    <span className="text-xs text-zinc-500 font-mono">+5%</span>
                                </div>
                                <h3 className="text-2xl font-bold text-white">${analytics.revenue}</h3>
                                <p className="text-sm text-zinc-500">Total Revenue</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><ServerIcon className="w-6 h-6"/></div>
                                </div>
                                <h3 className="text-2xl font-bold text-white">{analytics.totalInterviews}</h3>
                                <p className="text-sm text-zinc-500">Interviews Processed</p>
                            </div>
                            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><CpuChipIcon className="w-6 h-6"/></div>
                                </div>
                                <h3 className="text-2xl font-bold text-white">${analytics.apiCost.toFixed(2)}</h3>
                                <p className="text-sm text-zinc-500">Est. API Cost</p>
                            </div>
                        </div>

                        {/* Recent Activity Mock */}
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                            <h3 className="text-lg font-medium text-white mb-4">Recent System Events</h3>
                            <div className="space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-sm text-zinc-300">New interview completed by user_829{i}</span>
                                        </div>
                                        <span className="text-xs text-zinc-500">{i * 5}m ago</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {(activeTab === 'companies' || activeTab === 'applicants') && (
                    <div className="animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-white mb-6 capitalize">{activeTab} Directory</h2>
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-zinc-800/50 text-xs uppercase text-zinc-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Name</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Joined</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800">
                                    {(activeTab === 'companies' ? companies : applicants).map(user => (
                                        <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                                            <td className="px-6 py-4 text-zinc-400">{user.email}</td>
                                            <td className="px-6 py-4 text-zinc-500 text-sm">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => toggleUserStatus(user.id, user.status)}
                                                    className={`text-xs px-3 py-1.5 rounded transition-colors ${user.status === 'active' ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' : 'bg-green-900/20 text-green-400 hover:bg-green-900/40'}`}
                                                >
                                                    {user.status === 'active' ? 'Suspend' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(activeTab === 'companies' ? companies : applicants).length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-zinc-500">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'ai' && (
                    <div className="max-w-4xl animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-white mb-2">AI Configuration</h2>
                        <p className="text-zinc-400 mb-8">Manage the system prompts used by the Gemini models.</p>

                        <form onSubmit={handleSavePrompts} className="space-y-8">
                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-white">Interview Question Generation</h3>
                                    <span className="text-xs text-zinc-500 font-mono">Gemini 2.5 Flash</span>
                                </div>
                                <p className="text-sm text-zinc-500 mb-3">Variables: <code className="text-blue-400">{'{{jobTitle}}'}</code>, <code className="text-blue-400">{'{{requirements}}'}</code></p>
                                <textarea 
                                    className="w-full h-48 bg-black border border-zinc-700 rounded-lg p-4 font-mono text-sm text-zinc-300 focus:border-purple-500 outline-none leading-relaxed"
                                    value={prompts.questionGeneration}
                                    onChange={(e) => setPrompts({...prompts, questionGeneration: e.target.value})}
                                />
                            </div>

                            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-white">Candidate Profile & Resume Generation</h3>
                                    <span className="text-xs text-zinc-500 font-mono">Gemini 3 Pro</span>
                                </div>
                                <p className="text-sm text-zinc-500 mb-3">Variables: <code className="text-blue-400">{'{{transcript}}'}</code>, <code className="text-blue-400">{'{{avgScore}}'}</code></p>
                                <textarea 
                                    className="w-full h-64 bg-black border border-zinc-700 rounded-lg p-4 font-mono text-sm text-zinc-300 focus:border-purple-500 outline-none leading-relaxed"
                                    value={prompts.profileGeneration}
                                    onChange={(e) => setPrompts({...prompts, profileGeneration: e.target.value})}
                                />
                            </div>

                            <div className="flex items-center justify-end gap-4">
                                <button type="button" onClick={loadData} className="text-zinc-400 hover:text-white px-4 py-2">Reset to Saved</button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
                                >
                                    {isLoading ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <CheckCircleIcon className="w-4 h-4" />}
                                    Save Configurations
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="max-w-2xl animate-in fade-in duration-500">
                        <h2 className="text-2xl font-bold text-white mb-6">System Settings</h2>
                        
                        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-white font-medium">Allow New Registrations</h3>
                                    <p className="text-sm text-zinc-500">If disabled, no new companies or applicants can sign up.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSettings({...settings, allowNewRegistrations: !settings.allowNewRegistrations});
                                        // Auto-save for toggle feel
                                        Store.saveSettings({...settings, allowNewRegistrations: !settings.allowNewRegistrations});
                                    }}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.allowNewRegistrations ? 'bg-blue-600' : 'bg-zinc-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.allowNewRegistrations ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="flex items-center justify-between border-t border-zinc-800 pt-6">
                                <div>
                                    <h3 className="text-white font-medium">Maintenance Mode</h3>
                                    <p className="text-sm text-zinc-500">Disable access for non-admin users.</p>
                                </div>
                                <button 
                                    onClick={() => {
                                        setSettings({...settings, maintenanceMode: !settings.maintenanceMode});
                                        Store.saveSettings({...settings, maintenanceMode: !settings.maintenanceMode});
                                    }}
                                    className={`w-12 h-6 rounded-full transition-colors relative ${settings.maintenanceMode ? 'bg-red-600' : 'bg-zinc-700'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                                </button>
                            </div>

                            <div className="border-t border-zinc-800 pt-6">
                                <label className="block text-white font-medium mb-2">Default Interview Duration (Seconds)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="number" 
                                        value={settings.interviewDuration}
                                        onChange={(e) => setSettings({...settings, interviewDuration: parseInt(e.target.value)})}
                                        className="bg-black border border-zinc-700 rounded p-2 text-white w-32"
                                    />
                                    <button onClick={handleSaveSettings} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded">Update</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
