/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { CompanyAISettings, Store } from '../services/store';
import { 
    FaceSmileIcon, 
    ChatBubbleBottomCenterTextIcon, 
    AcademicCapIcon, 
    MicrophoneIcon, 
    ArrowsRightLeftIcon, 
    EyeIcon,
    PlusIcon,
    TrashIcon,
    PlayIcon,
    StopIcon,
    SpeakerWaveIcon,
    CheckCircleIcon
} from '@heroicons/react/24/outline';

interface CompanySettingsProps {
    companyId: string;
    onClose: () => void;
}

export const CompanySettings: React.FC<CompanySettingsProps> = ({ companyId, onClose }) => {
    const [settings, setSettings] = useState<CompanyAISettings | null>(null);
    const [activeTab, setActiveTab] = useState<'personality' | 'questions' | 'knowledge' | 'voice' | 'flow' | 'preview'>('personality');
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    
    // Preview State
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewStep, setPreviewStep] = useState(0);

    useEffect(() => {
        loadSettings();
    }, [companyId]);

    const loadSettings = () => {
        const data = Store.getCompanyAISettings(companyId);
        setSettings(data);
    };

    const handleSave = async () => {
        if (!settings) return;
        setIsSaving(true);
        await Store.saveCompanyAISettings(companyId, settings);
        setIsSaving(false);
        // Show success logic or toast could go here
    };

    const updateSlider = (key: keyof CompanyAISettings['sliders'], value: number) => {
        if (!settings) return;
        setSettings({
            ...settings,
            sliders: { ...settings.sliders, [key]: value }
        });
    };

    const updateWeight = (key: keyof CompanyAISettings['flow']['criteriaWeights'], value: number) => {
        if (!settings) return;
        setSettings({
            ...settings,
            flow: { 
                ...settings.flow, 
                criteriaWeights: { ...settings.flow.criteriaWeights, [key]: value } 
            }
        });
    };

    const addQuestion = () => {
        if (!settings) return;
        const newQ = {
            id: crypto.randomUUID(),
            text: '',
            category: 'Technical' as const,
            difficulty: 3,
            weight: 5
        };
        setSettings({
            ...settings,
            customQuestions: [...settings.customQuestions, newQ]
        });
    };

    const removeQuestion = (id: string) => {
        if (!settings) return;
        setSettings({
            ...settings,
            customQuestions: settings.customQuestions.filter(q => q.id !== id)
        });
    };

    const updateQuestion = (id: string, field: string, value: any) => {
        if (!settings) return;
        setSettings({
            ...settings,
            customQuestions: settings.customQuestions.map(q => 
                q.id === id ? { ...q, [field]: value } : q
            )
        });
    };

    // --- Render Components ---

    if (!settings) return <div className="p-8 text-white">Loading settings...</div>;

    const renderTabs = () => (
        <div className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col shrink-0">
            <div className="p-4 border-b border-zinc-800">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    AI Settings
                </h2>
                <p className="text-xs text-zinc-500 mt-1">Configure your interviewing agent.</p>
            </div>
            <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                {[
                    { id: 'personality', label: 'Agent Personality', icon: FaceSmileIcon },
                    { id: 'questions', label: 'Questions', icon: ChatBubbleBottomCenterTextIcon },
                    { id: 'knowledge', label: 'Industry Knowledge', icon: AcademicCapIcon },
                    { id: 'voice', label: 'Voice & Audio', icon: MicrophoneIcon },
                    { id: 'flow', label: 'Interview Flow', icon: ArrowsRightLeftIcon },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}
                    >
                        <item.icon className="w-5 h-5" /> {item.label}
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-zinc-800">
                <button 
                    onClick={() => setPreviewOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white py-2 rounded-lg text-sm font-bold border border-zinc-700 transition-colors"
                >
                    <EyeIcon className="w-4 h-4" /> Live Preview
                </button>
            </div>
        </div>
    );

    const renderPersonality = () => (
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">AI Agent Name</label>
                    <input 
                        type="text" 
                        value={settings.agentName}
                        onChange={(e) => setSettings({...settings, agentName: e.target.value})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Tone of Voice</label>
                    <select 
                        value={settings.tone}
                        onChange={(e) => setSettings({...settings, tone: e.target.value as any})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    >
                        {['Professional', 'Friendly', 'Neutral', 'Energetic', 'Calm'].map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Interview Style</label>
                    <select 
                        value={settings.style}
                        onChange={(e) => setSettings({...settings, style: e.target.value as any})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    >
                        {['Structured', 'Conversational', 'Behavioral', 'Technical', 'Creative'].map(o => <option key={o}>{o}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                <h3 className="font-bold text-white border-b border-zinc-800 pb-2 mb-4">Personality Calibration</h3>
                {[
                    { key: 'formality', label: 'Formality', left: 'Casual', right: 'Formal' },
                    { key: 'strictness', label: 'Strictness', left: 'Relaxed', right: 'Strict' },
                    { key: 'pacing', label: 'Pacing', left: 'Slow-paced', right: 'Fast-paced' },
                    { key: 'detail', label: 'Detail Level', left: 'High-level', right: 'Detailed-oriented' },
                ].map((slider) => (
                    <div key={slider.key}>
                        <div className="flex justify-between text-xs text-zinc-400 mb-2">
                            <span>{slider.left}</span>
                            <span className="text-white font-bold">{settings.sliders[slider.key as keyof typeof settings.sliders]}%</span>
                            <span>{slider.right}</span>
                        </div>
                        <input 
                            type="range" min="0" max="100"
                            value={settings.sliders[slider.key as keyof typeof settings.sliders]}
                            onChange={(e) => updateSlider(slider.key as any, parseInt(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    const renderQuestions = () => (
        <div className="max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div>
                    <h3 className="text-white font-bold">Auto Follow-up</h3>
                    <p className="text-xs text-zinc-500">Allow AI to generate spontaneous follow-up questions.</p>
                </div>
                <button 
                    onClick={() => setSettings({...settings, autoFollowUp: !settings.autoFollowUp})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.autoFollowUp ? 'bg-green-600' : 'bg-zinc-700'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.autoFollowUp ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>

            <div className="space-y-4">
                {settings.customQuestions.map((q, idx) => (
                    <div key={q.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex gap-4 items-start group">
                        <span className="text-zinc-500 font-mono pt-3">#{idx + 1}</span>
                        <div className="flex-1 space-y-3">
                            <input 
                                type="text" 
                                value={q.text}
                                onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                placeholder="Enter your custom interview question..."
                                className="w-full bg-black border border-zinc-700 rounded p-2 text-white text-sm focus:border-blue-500 outline-none"
                            />
                            <div className="flex gap-4">
                                <select 
                                    value={q.category}
                                    onChange={(e) => updateQuestion(q.id, 'category', e.target.value)}
                                    className="bg-zinc-800 text-xs text-zinc-300 rounded px-2 py-1 border border-zinc-700 outline-none"
                                >
                                    {['Technical', 'Soft Skills', 'Behavioral', 'Background', 'Culture'].map(c => <option key={c}>{c}</option>)}
                                </select>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <span>Difficulty:</span>
                                    <input 
                                        type="number" min="1" max="5" 
                                        value={q.difficulty}
                                        onChange={(e) => updateQuestion(q.id, 'difficulty', parseInt(e.target.value))}
                                        className="w-12 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white" 
                                    />
                                </div>
                                <div className="flex items-center gap-2 text-xs text-zinc-400">
                                    <span>Weight:</span>
                                    <input 
                                        type="number" min="1" max="10" 
                                        value={q.weight}
                                        onChange={(e) => updateQuestion(q.id, 'weight', parseInt(e.target.value))}
                                        className="w-12 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-white" 
                                    />
                                </div>
                            </div>
                        </div>
                        <button onClick={() => removeQuestion(q.id)} className="text-zinc-600 hover:text-red-500 pt-3">
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
                
                <button 
                    onClick={addQuestion}
                    className="w-full py-4 border-2 border-dashed border-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-white rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" /> Add Custom Question
                </button>
            </div>
        </div>
    );

    const renderKnowledge = () => (
        <div className="max-w-3xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-sm text-zinc-400">Provide context for the AI to understand your company better.</p>
            {[
                { key: 'mission', label: 'Company Mission & Values', ph: 'e.g. We value innovation, transparency...' },
                { key: 'roles', label: 'Key Roles & Responsibilities', ph: 'What defines success in this role?' },
                { key: 'stack', label: 'Technical Stack / Tools', ph: 'React, Node, AWS, Jira...' },
                { key: 'redFlags', label: 'Red Flags to Look For', ph: 'Arrogance, lack of specific knowledge...' },
                { key: 'idealProfile', label: 'Ideal Candidate Profile', ph: 'A self-starter who loves problem solving...' },
            ].map((field) => (
                <div key={field.key}>
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">{field.label}</label>
                    <textarea 
                        value={settings.trainingData[field.key as keyof typeof settings.trainingData]}
                        onChange={(e) => setSettings({
                            ...settings, 
                            trainingData: { ...settings.trainingData, [field.key]: e.target.value }
                        })}
                        placeholder={field.ph}
                        className="w-full h-24 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white text-sm focus:border-blue-500 outline-none resize-none"
                    />
                </div>
            ))}
        </div>
    );

    const renderVoice = () => (
        <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                <div>
                    <h3 className="text-white font-bold">Voice Output</h3>
                    <p className="text-xs text-zinc-500">Enable text-to-speech for the interviewer.</p>
                </div>
                <button 
                    onClick={() => setSettings({...settings, voice: { ...settings.voice, enabled: !settings.voice.enabled }})}
                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.voice.enabled ? 'bg-blue-600' : 'bg-zinc-700'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.voice.enabled ? 'left-7' : 'left-1'}`}></div>
                </button>
            </div>

            <div className={`space-y-6 transition-opacity ${settings.voice.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Select Voice</label>
                    <div className="grid grid-cols-2 gap-4">
                        {['Deep & Corporate', 'Warm & Friendly', 'Neutral & Professional', 'Tech & Robotic'].map((v, i) => (
                            <button 
                                key={i}
                                onClick={() => setSettings({...settings, voice: { ...settings.voice, voiceId: `voice_${i}` }})}
                                className={`p-4 rounded-xl border text-left transition-all ${settings.voice.voiceId === `voice_${i}` ? 'bg-blue-900/20 border-blue-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'}`}
                            >
                                <span className="block font-bold text-sm mb-1">{v}</span>
                                <span className="text-xs opacity-70">English (US)</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-6">
                    {['pitch', 'speed', 'intonation'].map((k) => (
                        <div key={k}>
                            <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                <span className="uppercase">{k}</span>
                                <span className="text-white font-bold">{settings.voice[k as keyof typeof settings.voice]}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100"
                                value={settings.voice[k as keyof typeof settings.voice] as number}
                                onChange={(e) => setSettings({
                                    ...settings, 
                                    voice: { ...settings.voice, [k]: parseInt(e.target.value) }
                                })}
                                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full font-bold transition-colors">
                        <PlayIcon className="w-5 h-5" /> Test Audio Sample
                    </button>
                </div>
            </div>
        </div>
    );

    const renderFlow = () => (
        <div className="max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Max Length (Minutes)</label>
                    <input 
                        type="number" 
                        value={settings.flow.maxLength}
                        onChange={(e) => setSettings({...settings, flow: { ...settings.flow, maxLength: parseInt(e.target.value) }})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Max Questions</label>
                    <input 
                        type="number" 
                        value={settings.flow.maxQuestions}
                        onChange={(e) => setSettings({...settings, flow: { ...settings.flow, maxQuestions: parseInt(e.target.value) }})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    />
                </div>
                <div className="col-span-2">
                    <label className="block text-xs font-medium text-zinc-400 uppercase mb-2">Decision Tree Style</label>
                    <select 
                        value={settings.flow.decisionTree}
                        onChange={(e) => setSettings({...settings, flow: { ...settings.flow, decisionTree: e.target.value as any }})}
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none"
                    >
                        <option value="Linear">Linear (Fixed Order)</option>
                        <option value="Dynamic">Dynamic Branching (Adapts to answers)</option>
                    </select>
                </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h3 className="font-bold text-white border-b border-zinc-800 pb-2 mb-6">Evaluation Criteria Weights</h3>
                <div className="space-y-6">
                    {Object.keys(settings.flow.criteriaWeights).map((key) => (
                        <div key={key}>
                            <div className="flex justify-between text-xs text-zinc-400 mb-2">
                                <span className="uppercase">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                <span className="text-white font-bold">{settings.flow.criteriaWeights[key as keyof typeof settings.flow.criteriaWeights]}%</span>
                            </div>
                            <input 
                                type="range" min="0" max="100"
                                value={settings.flow.criteriaWeights[key as keyof typeof settings.flow.criteriaWeights]}
                                onChange={(e) => updateWeight(key as any, parseInt(e.target.value))}
                                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderPreviewModal = () => {
        if (!previewOpen) return null;
        return (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-zinc-900 w-full max-w-2xl rounded-2xl border border-zinc-800 shadow-2xl overflow-hidden flex flex-col h-[600px] animate-in zoom-in duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-black/50">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                            <span className="font-bold text-white">Live Preview: {settings.agentName}</span>
                        </div>
                        <button onClick={() => setPreviewOpen(false)} className="text-zinc-500 hover:text-white">✕</button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-black relative">
                        {/* AI Avatar Placeholder */}
                        <div className="flex justify-center py-4">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 p-1 animate-pulse">
                                <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                                     <SpeakerWaveIcon className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Chat Bubbles */}
                        <div className="space-y-4">
                            <div className="flex gap-3 animate-in slide-in-from-left-4 duration-500">
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AI</div>
                                <div className="bg-zinc-800 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-sm text-zinc-200 shadow-lg">
                                    <p className="mb-2">Hello! I'm {settings.agentName}. I'll be conducting your interview today for the [Position Name] role.</p>
                                    <p>I see you have a background in [Tech Stack]. Can you tell me about a project where you utilized these skills?</p>
                                </div>
                            </div>

                            {previewStep > 0 && (
                                <div className="flex gap-3 flex-row-reverse animate-in slide-in-from-right-4 duration-500">
                                    <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold">You</div>
                                    <div className="bg-blue-900/20 border border-blue-500/20 rounded-2xl rounded-tr-none p-4 max-w-[80%] text-sm text-blue-100 shadow-lg">
                                        <p>Sure. In my last role, I built a scalable microservices architecture using Node.js...</p>
                                    </div>
                                </div>
                            )}

                             {previewStep > 1 && (
                                <div className="flex gap-3 animate-in slide-in-from-left-4 duration-500">
                                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold">AI</div>
                                    <div className="bg-zinc-800 rounded-2xl rounded-tl-none p-4 max-w-[80%] text-sm text-zinc-200 shadow-lg">
                                        <p>That sounds impressive. Did you face any specific challenges with data consistency in that distributed system?</p>
                                        <div className="mt-2 text-xs text-zinc-500 italic border-t border-zinc-700 pt-1">
                                            (Tone: {settings.tone}, Style: {settings.style})
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center">
                        <button 
                            onClick={() => setPreviewStep(0)} 
                            className="text-xs text-zinc-500 hover:text-white"
                        >
                            Reset Preview
                        </button>
                        <button 
                            onClick={() => setPreviewStep(prev => prev + 1)} 
                            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold"
                            disabled={previewStep > 1}
                        >
                            {previewStep > 1 ? 'End of Preview' : 'Next Interaction'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row h-full bg-black min-h-[600px] border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
            {renderTabs()}
            
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <div className="p-6 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-white">
                        {activeTab === 'personality' && 'Agent Personality'}
                        {activeTab === 'questions' && 'Question Customization'}
                        {activeTab === 'knowledge' && 'Industry Knowledge'}
                        {activeTab === 'voice' && 'Voice & Audio'}
                        {activeTab === 'flow' && 'Interview Flow'}
                    </h2>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="text-zinc-400 hover:text-white px-4 py-2 text-sm">Cancel</button>
                        <button 
                            onClick={handleSave} 
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 flex items-center gap-2"
                        >
                            {isSaving ? 'Saving...' : <><CheckCircleIcon className="w-4 h-4"/> Save Changes</>}
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 bg-black">
                    {activeTab === 'personality' && renderPersonality()}
                    {activeTab === 'questions' && renderQuestions()}
                    {activeTab === 'knowledge' && renderKnowledge()}
                    {activeTab === 'voice' && renderVoice()}
                    {activeTab === 'flow' && renderFlow()}
                </div>
            </div>

            {renderPreviewModal()}
        </div>
    );
};