
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
import { useI18n } from '../services/i18n';
import { LanguageSwitcher } from './LanguageSwitcher';

interface FeaturesProps {
    onBack: () => void;
    onLoginClick: () => void;
    onGetStarted: () => void;
    onViewHowItWorks: () => void;
    onViewPricing: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onBack, onLoginClick, onGetStarted, onViewHowItWorks, onViewPricing }) => {
    const { language } = useI18n();
    const tr = (en: string, pt: string, es: string) => (language === 'pt-PT' ? pt : language === 'es' ? es : en);
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
                        <button onClick={onBack} className="hover:text-white transition-colors">{tr('Home', 'Início', 'Inicio')}</button>
                        <button className="text-white transition-colors">{tr('Features', 'Funcionalidades', 'Funciones')}</button>
                        <button onClick={onViewHowItWorks} className="hover:text-white transition-colors">{tr('How it Works', 'Como Funciona', 'Cómo Funciona')}</button>
                        <button onClick={onViewPricing} className="hover:text-white transition-colors">{tr('Pricing', 'Preços', 'Precios')}</button>
                    </div>

                    <div className="flex items-center gap-3">
                        <LanguageSwitcher />
                        <button 
                            onClick={onLoginClick}
                            className="ui-action-ghost"
                        >
                            {tr('Log In', 'Entrar', 'Iniciar sesión')}
                        </button>
                    </div>
                </div>
                <div className="md:hidden border-t border-slate-700/30">
                    <div className="max-w-7xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto text-xs text-zinc-300">
                        <button onClick={onBack} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{tr('Home', 'Início', 'Inicio')}</button>
                        <button className="px-3 py-1.5 rounded-full border border-blue-500/40 text-blue-300 whitespace-nowrap">{tr('Features', 'Funcionalidades', 'Funciones')}</button>
                        <button onClick={onViewHowItWorks} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{tr('How it Works', 'Como Funciona', 'Cómo Funciona')}</button>
                        <button onClick={onViewPricing} className="px-3 py-1.5 rounded-full border border-slate-700/50 whitespace-nowrap">{tr('Pricing', 'Preços', 'Precios')}</button>
                    </div>
                </div>
            </nav>

            {/* Hero Banner */}
            <section className="relative pt-36 pb-20 lg:pt-40 lg:pb-24 overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 text-zinc-400 text-xs font-medium border border-zinc-800 mb-8 animate-in fade-in zoom-in duration-700">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        <span>{tr('v2.0 Now Live', 'v2.0 já disponível', 'v2.0 ya disponible')}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-white animate-in fade-in slide-in-from-bottom-8 duration-700">
                        {tr('Powerful AI Features', 'Funcionalidades IA Poderosas', 'Funciones IA Potentes')} <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{tr('That Transform Hiring', 'Que Transformam o Recrutamento', 'Que Transforman la Contratación')}</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        {tr(
                            'Discover everything our platform offers to simplify recruitment and help applicants shine. From intelligent interviews to automated paperwork.',
                            'Descubra tudo o que a nossa plataforma oferece para simplificar o recrutamento e ajudar candidatos a destacar-se. Das entrevistas inteligentes à automatização documental.',
                            'Descubre todo lo que nuestra plataforma ofrece para simplificar el reclutamiento y ayudar a los candidatos a destacar. Desde entrevistas inteligentes hasta automatización documental.'
                        )}
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
                            <h3 className="text-xl font-bold mb-3 text-white">{tr('AI Interviewer', 'Entrevistador IA', 'Entrevistador IA')}</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <VideoCameraIcon className="w-5 h-5 text-blue-500/70 shrink-0" />
                                    <span>{tr('Real-time conversational AI adapts to candidate answers.', 'IA conversacional em tempo real adapta-se às respostas do candidato.', 'IA conversacional en tiempo real se adapta a las respuestas del candidato.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-blue-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Generates adaptive follow-up questions.', 'Gera perguntas de seguimento adaptativas.', 'Genera preguntas de seguimiento adaptativas.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-blue-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Full video recording & automated transcripts.', 'Gravação total em vídeo e transcrições automáticas.', 'Grabación completa en vídeo y transcripciones automáticas.')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* B. Smart CV */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-purple-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-purple-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <DocumentMagnifyingGlassIcon className="w-6 h-6 text-purple-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{tr('Smart CV Analyzer', 'Analisador Inteligente de CV', 'Analizador Inteligente de CV')}</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-purple-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Extracts key skills, experience, and education instantly.', 'Extrai competências, experiência e formação instantaneamente.', 'Extrae habilidades clave, experiencia y formación al instante.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-purple-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Generates summaries and categorizes talent.', 'Gera resumos e categoriza talento.', 'Genera resúmenes y categoriza talento.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <DocumentTextIcon className="w-5 h-5 text-purple-500/70 shrink-0" />
                                    <span>{tr('Works with PDF, DOCX, or starts from scratch.', 'Funciona com PDF, DOCX ou começa do zero.', 'Funciona con PDF, DOCX o desde cero.')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* C. Auto Resume */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-green-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-green-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <SparklesIcon className="w-6 h-6 text-green-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{tr('Auto-Resume Gen', 'Gerador Automático de CV', 'Generador Automático de CV')}</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('AI-crafted professional Markdown resumes.', 'CVs profissionais em Markdown criados por IA.', 'CVs profesionales en Markdown creados por IA.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Includes personality profile & strengths overview.', 'Inclui perfil de personalidade e visão geral de pontos fortes.', 'Incluye perfil de personalidad y resumen de fortalezas.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-green-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Calculates objective Job Match Scores.', 'Calcula pontuação objetiva de compatibilidade.', 'Calcula puntuación objetiva de compatibilidad.')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* D. Candidate Dashboard */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-pink-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-pink-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <UserIcon className="w-6 h-6 text-pink-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{tr('Candidate Dashboard', 'Dashboard do Candidato', 'Panel del Candidato')}</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Track interview status and history.', 'Acompanhe estado e histórico das entrevistas.', 'Sigue el estado e historial de entrevistas.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('View and download AI-generated resumes.', 'Veja e descarregue CVs gerados por IA.', 'Ve y descarga CVs generados por IA.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-pink-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Manage profile and applications in one place.', 'Gira perfil e candidaturas num só lugar.', 'Gestiona perfil y postulaciones en un solo lugar.')}</span>
                                </li>
                            </ul>
                        </div>

                        {/* E. Company Dashboard */}
                        <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-orange-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-orange-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <PresentationChartLineIcon className="w-6 h-6 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{tr('Company Dashboard', 'Dashboard da Empresa', 'Panel de Empresa')}</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <BuildingOfficeIcon className="w-5 h-5 text-orange-500/70 shrink-0" />
                                    <span>{tr('Create and manage detailed job positions.', 'Crie e gira vagas detalhadas.', 'Crea y gestiona vacantes detalladas.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-orange-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Watch video recordings & read transcripts.', 'Veja gravações de vídeo e leia transcrições.', 'Ve grabaciones de vídeo y lee transcripciones.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-orange-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Advanced filtering, scoring, and talent insights.', 'Filtragem avançada, scoring e insights de talento.', 'Filtrado avanzado, scoring e insights de talento.')}</span>
                                </li>
                            </ul>
                        </div>

                         {/* F. Privacy & Security */}
                         <div className="bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 hover:border-teal-500/50 hover:bg-zinc-900/60 transition-all duration-300 group">
                            <div className="w-12 h-12 bg-teal-900/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheckIcon className="w-6 h-6 text-teal-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-white">{tr('Privacy & Security', 'Privacidade e Segurança', 'Privacidad y Seguridad')}</h3>
                            <ul className="space-y-3 text-zinc-400 text-sm">
                                <li className="flex items-start gap-2">
                                    <LockClosedIcon className="w-5 h-5 text-teal-500/70 shrink-0" />
                                    <span>{tr('GDPR compliant data processing.', 'Processamento de dados em conformidade com RGPD.', 'Procesamiento de datos conforme al RGPD.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-teal-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Secure cloud file storage.', 'Armazenamento seguro de ficheiros na cloud.', 'Almacenamiento seguro de archivos en la nube.')}</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <ArrowRightIcon className="w-4 h-4 text-teal-500/70 shrink-0 mt-0.5" />
                                    <span>{tr('Encrypted video management.', 'Gestão de vídeo encriptada.', 'Gestión de vídeo cifrada.')}</span>
                                </li>
                            </ul>
                        </div>

                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 border-t border-zinc-900 bg-zinc-900/20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">{tr('Ready to transform your process?', 'Pronto para transformar o seu processo?', '¿Listo para transformar tu proceso?')}</h2>
                    <p className="text-zinc-400 mb-8 text-lg">{tr('Join thousands of companies and applicants using AI to find the perfect match.', 'Junte-se a milhares de empresas e candidatos que usam IA para encontrar o match ideal.', 'Únete a miles de empresas y candidatos que usan IA para encontrar el match perfecto.')}</p>
                    <button 
                        onClick={onGetStarted}
                        className="bg-white text-black hover:bg-zinc-200 px-8 py-4 rounded-full font-bold text-lg transition-colors shadow-lg shadow-white/5"
                    >
                        {tr('Get Started Now', 'Começar Agora', 'Empezar Ahora')}
                    </button>
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
