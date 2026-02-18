
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
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '../services/i18n';

interface LandingProps {
    onLoginClick: () => void;
    onGetStarted: (role: 'company' | 'applicant') => void;
    onViewFeatures: () => void;
    onViewHowItWorks: () => void;
    onViewPricing: () => void;
}

export const Landing: React.FC<LandingProps> = ({ onLoginClick, onGetStarted, onViewFeatures, onViewHowItWorks, onViewPricing }) => {
    const { t, language } = useI18n();
    const tr = (en: string, pt: string, es: string) => (language === 'pt-PT' ? pt : language === 'es' ? es : en);
    return (
        <div className="ui-shell font-sans">
            {/* Navigation */}
            <nav className="ui-nav">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">T</div>
                        <span className="font-bold text-lg tracking-tight">Talent Finder</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <button onClick={onViewFeatures} className="hover:text-white transition-colors">{t('nav_features', 'Features')}</button>
                        <button onClick={onViewHowItWorks} className="hover:text-white transition-colors">{t('nav_how', 'How it Works')}</button>
                        <button onClick={onViewPricing} className="hover:text-white transition-colors">{t('nav_pricing', 'Pricing')}</button>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button 
                            onClick={onLoginClick}
                            className="ui-action-ghost"
                        >
                            {t('nav_login', 'Log In')}
                        </button>
                    </div>
                </div>
                <div className="md:hidden border-t border-slate-700/30">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-xs text-zinc-300">
                        <button onClick={onViewFeatures} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{t('nav_features', 'Features')}</button>
                        <button onClick={onViewHowItWorks} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{t('nav_how', 'How it Works')}</button>
                        <button onClick={onViewPricing} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{t('nav_pricing', 'Pricing')}</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-36 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950/0 to-transparent pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium border border-blue-500/20 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <SparklesIcon className="w-3 h-3" />
                        <span>{t('landing_tagline', 'The Future of Recruitment is Here')}</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {t('landing_title_line1', 'AI Interviews.')} <br className="hidden md:block" />
                        <span className="text-white">{t('landing_title_line2', 'Smart Hiring.')}</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        {t('landing_subtitle', 'Automated video interviews, real-time behavioral analysis, and instant resume generation. Talent Finder connects top talent with companies faster than ever.')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <button 
                            onClick={() => onGetStarted('company')}
                            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-zinc-100 transition-all flex items-center justify-center gap-2 group"
                        >
                            <BuildingOfficeIcon className="w-5 h-5" />
                            {t('landing_company_btn', "I'm a Company")}
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button 
                            onClick={() => onGetStarted('applicant')}
                            className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 text-white font-bold rounded-full border border-slate-600/50 hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                        >
                            <UserIcon className="w-5 h-5" />
                            {t('landing_applicant_btn', "I'm an Applicant")}
                        </button>
                    </div>
                </div>
            </section>

            {/* How It Works Teaser (Clickable) */}
            <section className="py-24 border-t border-zinc-900 bg-zinc-950/50 cursor-pointer hover:bg-zinc-900/30 transition-colors" onClick={onViewHowItWorks}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">{t('landing_how_title', 'How It Works')}</h2>
                        <p className="text-zinc-400 flex items-center justify-center gap-2">
                            {t('landing_how_sub', 'Three simple steps to your next opportunity.')}
                            <ArrowRightIcon className="w-4 h-4" />
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: DocumentArrowUpIcon,
                                title: tr('1. Upload or Create', '1. Carregar ou Criar', '1. Subir o Crear'),
                                desc: tr('Applicants upload resumes. Companies post detailed job requirements.', 'Candidatos carregam CVs. Empresas publicam requisitos detalhados da vaga.', 'Los candidatos suben CV. Las empresas publican requisitos detallados del puesto.')
                            },
                            {
                                icon: VideoCameraIcon,
                                title: tr('2. AI Interview', '2. Entrevista com IA', '2. Entrevista con IA'),
                                desc: tr('Candidates answer dynamic, role-specific questions via video. AI records & transcribes.', 'Candidatos respondem por vídeo a perguntas dinâmicas e específicas da função. A IA grava e transcreve.', 'Los candidatos responden por vídeo preguntas dinámicas y específicas del rol. La IA graba y transcribe.')
                            },
                            {
                                icon: DocumentCheckIcon,
                                title: tr('3. Smart Analysis', '3. Análise Inteligente', '3. Análisis Inteligente'),
                                desc: tr('Get an instant AI-generated resume, skill score, and behavioral profile.', 'Receba de imediato CV gerado por IA, pontuação de competências e perfil comportamental.', 'Recibe al instante CV generado por IA, puntuación de habilidades y perfil conductual.')
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
                            <h2 className="text-3xl font-bold mb-4">{tr('Powered by Advanced AI', 'Impulsionado por IA Avançada', 'Impulsado por IA Avanzada')}</h2>
                            <p className="text-zinc-400 max-w-xl">{tr('Leveraging Gemini 2.5 and 3.0 Pro models to understand context, tone, and technical accuracy.', 'Aproveita modelos Gemini 2.5 e 3.0 Pro para compreender contexto, tom e precisão técnica.', 'Aprovecha modelos Gemini 2.5 y 3.0 Pro para entender contexto, tono y precisión técnica.')}</p>
                        </div>
                        <button onClick={onViewFeatures} className="hidden md:flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            {tr('View All Features', 'Ver Todas as Funcionalidades', 'Ver Todas las Funciones')} <ArrowRightIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl border border-zinc-800">
                            <CpuChipIcon className="w-10 h-10 text-purple-500 mb-6" />
                            <h3 className="text-2xl font-bold mb-2">{tr('Adaptive Questioning', 'Perguntas Adaptativas', 'Preguntas Adaptativas')}</h3>
                            <p className="text-zinc-400">{tr("The AI doesn't just read a script. It generates questions based on the specific job description and skills required, ensuring every interview is relevant.", 'A IA não segue apenas um guião. Gera perguntas com base na descrição da vaga e competências necessárias, garantindo relevância em cada entrevista.', 'La IA no sigue solo un guion. Genera preguntas según la descripción del puesto y las habilidades requeridas, garantizando relevancia en cada entrevista.')}</p>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                            <VideoCameraIcon className="w-10 h-10 text-blue-500 mb-6" />
                            <h3 className="text-xl font-bold mb-2">{tr('Video Analysis', 'Análise de Vídeo', 'Análisis de Vídeo')}</h3>
                            <p className="text-zinc-400">{tr('Records and analyzes video for soft skills, confidence, and clarity.', 'Grava e analisa vídeo para soft skills, confiança e clareza.', 'Graba y analiza vídeo para habilidades blandas, confianza y claridad.')}</p>
                        </div>
                        <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
                            <DocumentCheckIcon className="w-10 h-10 text-green-500 mb-6" />
                            <h3 className="text-xl font-bold mb-2">{tr('Auto-Resume', 'CV Automático', 'CV Automático')}</h3>
                            <p className="text-zinc-400">{tr('Generates a formatted, professional Markdown resume based on interview performance.', 'Gera CV profissional em Markdown com base no desempenho da entrevista.', 'Genera un CV profesional en Markdown según el desempeño en la entrevista.')}</p>
                        </div>
                        <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 rounded-2xl border border-zinc-800 flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <ShieldCheckIcon className="w-10 h-10 text-orange-500 mb-6" />
                                <h3 className="text-2xl font-bold mb-2">{tr('Enterprise Grade Dashboard', 'Dashboard de Nível Empresarial', 'Dashboard de Nivel Empresarial')}</h3>
                                <p className="text-zinc-400">{tr('Centralized hubs for both applicants and companies to track progress, view scores, and manage data securely.', 'Centro centralizado para candidatos e empresas acompanharem progresso, ver pontuações e gerir dados com segurança.', 'Centro centralizado para candidatos y empresas para seguir progreso, ver puntuaciones y gestionar datos con seguridad.')}</p>
                            </div>
                             <div className="shrink-0">
                                <button onClick={onViewFeatures} className="text-sm font-bold border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-white px-6 py-3 rounded-full transition-colors">
                                    {tr('Explore Features', 'Explorar Funcionalidades', 'Explorar Funciones')}
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
                        <h2 className="text-3xl font-bold mb-4 text-white">{tr('For Companies', 'Para Empresas', 'Para Empresas')}</h2>
                        <ul className="space-y-4 mb-8 text-zinc-400">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                {tr('Screen hundreds of candidates in minutes', 'Triagem de centenas de candidatos em minutos', 'Filtra cientos de candidatos en minutos')}
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                {tr('Objective, AI-driven scoring', 'Pontuação objetiva com IA', 'Puntuación objetiva con IA')}
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                {tr('Consistent interview experience', 'Experiência de entrevista consistente', 'Experiencia de entrevista consistente')}
                            </li>
                        </ul>
                        <button 
                            onClick={() => onGetStarted('company')}
                            className="self-start text-sm font-bold text-white border-b border-blue-500 pb-1 hover:text-blue-400 transition-colors"
                        >
                            {tr('Create Company Account', 'Criar Conta de Empresa', 'Crear Cuenta de Empresa')}
                        </button>
                    </div>

                    {/* Applicants */}
                    <div className="bg-black px-8 py-20 lg:px-20 flex flex-col justify-center">
                         <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                            <UserIcon className="w-6 h-6 text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4 text-white">{tr('For Applicants', 'Para Candidatos', 'Para Candidatos')}</h2>
                        <ul className="space-y-4 mb-8 text-zinc-400">
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                {tr('Practice interviews with real-time feedback', 'Pratique entrevistas com feedback em tempo real', 'Practica entrevistas con feedback en tiempo real')}
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                {tr('Get an AI-enhanced resume automatically', 'Receba automaticamente um CV melhorado por IA', 'Obtén automáticamente un CV mejorado con IA')}
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                                {tr('Apply to multiple jobs with one profile', 'Candidate-se a várias vagas com um só perfil', 'Postúlate a múltiples vacantes con un solo perfil')}
                            </li>
                        </ul>
                        <button 
                             onClick={() => onGetStarted('applicant')}
                            className="self-start text-sm font-bold text-white border-b border-purple-500 pb-1 hover:text-purple-400 transition-colors"
                        >
                            {tr('Create Applicant Account', 'Criar Conta de Candidato', 'Crear Cuenta de Candidato')}
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950/60 border-t border-slate-800/60 py-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center font-bold text-xs text-white">T</div>
                        <span className="font-bold text-zinc-300">Talent Finder</span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-zinc-500">
                        <a href="#" className="hover:text-white">{tr('Privacy Policy', 'Política de Privacidade', 'Política de Privacidad')}</a>
                        <a href="#" className="hover:text-white">{tr('Terms of Service', 'Termos de Serviço', 'Términos del Servicio')}</a>
                        <a href="#" className="hover:text-white">{tr('Contact Support', 'Contactar Suporte', 'Contactar Soporte')}</a>
                    </div>
                    <div className="text-xs text-zinc-600">
                        {tr('Powered by Google AI', 'Powered by Google AI', 'Powered by Google AI')}
                    </div>
                </div>
            </footer>
        </div>
    );
};
