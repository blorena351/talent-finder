
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
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
import { LanguageSwitcher } from './LanguageSwitcher';
import { useI18n } from '../services/i18n';

interface HowItWorksProps {
    onBack: () => void;
    onLoginClick: () => void;
    onGetStarted: (role: 'company' | 'applicant') => void;
    onViewPricing: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onLoginClick, onGetStarted, onViewPricing }) => {
    const { t, language } = useI18n();
    const tr = (en: string, pt: string, es: string) => (language === 'pt-PT' ? pt : language === 'es' ? es : en);
    const applicantSteps = [
        {
            title: language === 'pt-PT' ? 'Crie a sua conta' : language === 'es' ? 'Crea tu cuenta' : "Create Your Account",
            desc: language === 'pt-PT'
                ? 'Registe-se com email ou Google. Construa o seu perfil básico em segundos.'
                : language === 'es'
                    ? 'Regístrate con correo o Google. Crea tu perfil básico en segundos.'
                    : 'Sign up instantly with email or Google. Build your basic profile in seconds.',
            icon: UserIcon
        },
        {
            title: tr('Upload Your CV (Optional)', 'Carregue o Seu CV (Opcional)', 'Sube tu CV (Opcional)'),
            desc: tr('Upload an existing resume for analysis, or skip this step and let our AI build one for you later.', 'Carregue um CV existente para análise, ou ignore este passo e deixe a IA criar um por si mais tarde.', 'Sube un CV existente para análisis o salta este paso y deja que la IA cree uno más tarde.'),
            icon: DocumentArrowUpIcon
        },
        {
            title: tr('Start AI Video Interview', 'Inicie Entrevista Vídeo com IA', 'Inicia Entrevista en Vídeo con IA'),
            desc: tr('Answer dynamic, role-specific questions on camera. The AI records and transcribes your responses in real-time.', 'Responda em vídeo a perguntas dinâmicas e específicas da função. A IA grava e transcreve as respostas em tempo real.', 'Responde en vídeo preguntas dinámicas y específicas del puesto. La IA graba y transcribe tus respuestas en tiempo real.'),
            icon: VideoCameraIcon
        },
        {
            title: tr('See Your AI-Generated Resume', 'Veja o Seu CV Gerado por IA', 'Mira tu CV Generado por IA'),
            desc: tr('Receive a professional Markdown resume, skill map, and personality summary based on your performance.', 'Receba um CV profissional em Markdown, mapa de competências e resumo de perfil com base no seu desempenho.', 'Recibe un CV profesional en Markdown, mapa de habilidades y resumen de perfil según tu desempeño.'),
            icon: SparklesIcon
        },
        {
            title: tr('Track Your Progress', 'Acompanhe o Seu Progresso', 'Sigue tu Progreso'),
            desc: tr('Use your dashboard to manage applications, view match scores, and apply to new roles.', 'Use o dashboard para gerir candidaturas, ver pontuações e candidatar-se a novas vagas.', 'Usa tu panel para gestionar postulaciones, ver puntuaciones y postularte a nuevas vacantes.'),
            icon: ChartBarIcon
        }
    ];

    const companySteps = [
        {
            title: language === 'pt-PT' ? 'Crie conta de empresa' : language === 'es' ? 'Crea cuenta de empresa' : "Create Company Account",
            desc: language === 'pt-PT'
                ? 'Configure o perfil da organização, setor e marca.'
                : language === 'es'
                    ? 'Configura el perfil de la organización, sector y marca.'
                    : 'Set up your organization profile, industry details, and branding.',
            icon: BuildingOfficeIcon
        },
        {
            title: tr('Configure Interview Settings', 'Configurar Definições de Entrevista', 'Configurar Ajustes de Entrevista'),
            desc: tr('Post jobs and define requirements. The AI automatically generates a question bank tailored to the role.', 'Publique vagas e defina requisitos. A IA gera automaticamente um conjunto de perguntas ajustado à função.', 'Publica vacantes y define requisitos. La IA genera automáticamente un banco de preguntas adaptado al puesto.'),
            icon: Cog6ToothIcon
        },
        {
            title: tr('AI Interviews Applicants', 'IA Entrevista Candidatos', 'IA Entrevista Candidatos'),
            desc: tr('The system conducts video interviews 24/7, ensuring consistent questioning for every candidate.', 'O sistema realiza entrevistas em vídeo 24/7, garantindo perguntas consistentes para cada candidato.', 'El sistema realiza entrevistas en vídeo 24/7, garantizando preguntas consistentes para cada candidato.'),
            icon: ChatBubbleLeftRightIcon
        },
        {
            title: tr('Review Candidates', 'Rever Candidatos', 'Revisar Candidatos'),
            desc: tr('Watch video highlights, read transcripts, and view AI-calculated match scores and generated resumes.', 'Veja vídeos, leia transcrições e analise pontuações de compatibilidade e CVs gerados por IA.', 'Ve vídeos, lee transcripciones y revisa puntuaciones de compatibilidad y CVs generados por IA.'),
            icon: PresentationChartLineIcon
        },
        {
            title: tr('Manage Talent Pipeline', 'Gerir Pipeline de Talento', 'Gestionar Pipeline de Talento'),
            desc: tr('Shortlist top performers, export data, and streamline your hiring decision process.', 'Faça shortlist dos melhores perfis, exporte dados e acelere decisões de contratação.', 'Haz shortlist de los mejores perfiles, exporta datos y acelera decisiones de contratación.'),
            icon: UserGroupIcon
        }
    ];

    return (
        <div className="ui-shell font-sans">
            {/* Navigation */}
            <nav className="ui-nav">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20">T</div>
                        <span className="font-bold text-lg tracking-tight">Talent Finder</span>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <button onClick={onBack} className="hover:text-white transition-colors">{t('nav_home', 'Home')}</button>
                        <button className="text-white transition-colors">{t('nav_how', 'How it Works')}</button>
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
                        <button onClick={onBack} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{t('nav_home', 'Home')}</button>
                        <button className="px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-300 whitespace-nowrap">{t('nav_how', 'How it Works')}</button>
                        <button onClick={onViewPricing} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{t('nav_pricing', 'Pricing')}</button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="pt-36 pb-16 text-center px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 text-xs font-medium border border-zinc-800 mb-6 animate-in fade-in zoom-in duration-700">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                        <span>{language === 'pt-PT' ? 'Fluxo sem fricção' : language === 'es' ? 'Flujo sin fricción' : 'Seamless Workflow'}</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {t('how_title', 'How It Works')}
                    </h1>
                    <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {t('how_subtitle', 'From interview to insight — here’s how our AI transforms the hiring experience for everyone involved.')}
                    </p>
                </div>
            </section>

            {/* Two-Column Steps */}
            <section className="py-12 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <UserIcon className="w-5 h-5 text-blue-400" />
                            <h3 className="text-xl font-bold text-white">{t('how_for_applicants', 'For Applicants')}</h3>
                        </div>
                        <div className="space-y-4">
                            {applicantSteps.map((step, index) => (
                                <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                                            <step.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 font-mono mb-1">STEP 0{index + 1}</div>
                                            <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
                                            <p className="text-zinc-400">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <BuildingOfficeIcon className="w-5 h-5 text-purple-400" />
                            <h3 className="text-xl font-bold text-white">{t('how_for_companies', 'For Companies')}</h3>
                        </div>
                        <div className="space-y-4">
                            {companySteps.map((step, index) => (
                                <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-lg bg-purple-600 flex items-center justify-center shrink-0">
                                            <step.icon className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 font-mono mb-1">STEP 0{index + 1}</div>
                                            <h4 className="text-lg font-semibold text-white mb-1">{step.title}</h4>
                                            <p className="text-zinc-400">{step.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 border-t border-zinc-900 mt-12 bg-zinc-900/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{t('how_cta_title', 'Ready to get started?')}</h2>
                    <p className="text-zinc-400 mb-8 text-lg">
                        {t('how_cta_sub', 'Join as an applicant or onboard your company in minutes.')}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => onGetStarted('applicant')}
                            className="px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white"
                        >
                            <CheckIcon className="w-5 h-5" />
                            {t('how_cta_applicant', 'Create Applicant Account')}
                        </button>
                        <button 
                            onClick={() => onGetStarted('company')}
                            className="px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white"
                        >
                            <CheckIcon className="w-5 h-5" />
                            {t('how_cta_company', 'Create Company Account')}
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
