import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type LanguageCode = 'en' | 'pt-PT' | 'es';

type I18nContextType = {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback: string) => string;
};

const LANGUAGE_KEY = 'talent_finder_language';

const translations: Record<LanguageCode, Record<string, string>> = {
  en: {
    lang_label: 'Language',
    nav_features: 'Features',
    nav_how: 'How it Works',
    nav_pricing: 'Pricing',
    nav_login: 'Log In',
    nav_home: 'Home',
    auth_create_account: 'Create your account',
    auth_join: 'Join Talent Finder today. Choose your path to get started.',
    auth_applicant: "I'm an Applicant",
    auth_company: "I'm a Company",
    auth_already: 'Already have an account?',
    auth_login_here: 'Log in here',
    auth_signup_as: 'Sign up as',
    auth_credentials: 'Create your credentials to continue.',
    auth_email: 'Email',
    auth_password: 'Password',
    auth_confirm_password: 'Confirm Password',
    auth_create_btn: 'Create Account',
    auth_welcome_back: 'Welcome Back',
    auth_login_access: 'Log in to access your dashboard.',
    app_logged_as: 'Logged in as',
    app_sign_out: 'Sign Out',
    landing_tagline: 'The Future of Recruitment is Here',
    landing_title_line1: 'AI Interviews.',
    landing_title_line2: 'Smart Hiring.',
    landing_subtitle:
      'Automated video interviews, real-time behavioral analysis, and instant resume generation. Talent Finder connects top talent with companies faster than ever.',
    landing_company_btn: "I'm a Company",
    landing_applicant_btn: "I'm an Applicant",
    landing_how_title: 'How It Works',
    landing_how_sub: 'Three simple steps to your next opportunity.',
    how_title: 'How It Works',
    how_subtitle:
      'From interview to insight — here’s how our AI transforms the hiring experience for everyone involved.',
    how_for_applicants: 'For Applicants',
    how_for_companies: 'For Companies',
    how_cta_title: 'Ready to get started?',
    how_cta_sub: 'Join as an applicant or onboard your company in minutes.',
    how_cta_applicant: 'Create Applicant Account',
    how_cta_company: 'Create Company Account',
  },
  'pt-PT': {
    lang_label: 'Idioma',
    nav_features: 'Funcionalidades',
    nav_how: 'Como Funciona',
    nav_pricing: 'Preços',
    nav_login: 'Entrar',
    nav_home: 'Início',
    auth_create_account: 'Crie a sua conta',
    auth_join: 'Junte-se ao Talent Finder hoje. Escolha o seu caminho para começar.',
    auth_applicant: 'Sou Candidato',
    auth_company: 'Sou Empresa',
    auth_already: 'Já tem conta?',
    auth_login_here: 'Entrar aqui',
    auth_signup_as: 'Registar como',
    auth_credentials: 'Crie as suas credenciais para continuar.',
    auth_email: 'Email',
    auth_password: 'Palavra-passe',
    auth_confirm_password: 'Confirmar palavra-passe',
    auth_create_btn: 'Criar Conta',
    auth_welcome_back: 'Bem-vindo de volta',
    auth_login_access: 'Inicie sessão para aceder ao seu painel.',
    app_logged_as: 'Sessão iniciada como',
    app_sign_out: 'Terminar sessão',
    landing_tagline: 'O Futuro do Recrutamento Está Aqui',
    landing_title_line1: 'Entrevistas com IA.',
    landing_title_line2: 'Contratação Inteligente.',
    landing_subtitle:
      'Entrevistas em vídeo automatizadas, análise comportamental em tempo real e geração instantânea de currículo. O Talent Finder liga talento às empresas mais depressa.',
    landing_company_btn: 'Sou Empresa',
    landing_applicant_btn: 'Sou Candidato',
    landing_how_title: 'Como Funciona',
    landing_how_sub: 'Três passos simples para a sua próxima oportunidade.',
    how_title: 'Como Funciona',
    how_subtitle:
      'Da entrevista ao insight — veja como a nossa IA transforma a experiência de recrutamento para todos.',
    how_for_applicants: 'Para Candidatos',
    how_for_companies: 'Para Empresas',
    how_cta_title: 'Pronto para começar?',
    how_cta_sub: 'Registe-se como candidato ou empresa em poucos minutos.',
    how_cta_applicant: 'Criar Conta de Candidato',
    how_cta_company: 'Criar Conta de Empresa',
  },
  es: {
    lang_label: 'Idioma',
    nav_features: 'Funciones',
    nav_how: 'Cómo Funciona',
    nav_pricing: 'Precios',
    nav_login: 'Iniciar sesión',
    nav_home: 'Inicio',
    auth_create_account: 'Crea tu cuenta',
    auth_join: 'Únete a Talent Finder hoy. Elige tu camino para comenzar.',
    auth_applicant: 'Soy Candidato',
    auth_company: 'Soy Empresa',
    auth_already: '¿Ya tienes cuenta?',
    auth_login_here: 'Inicia sesión aquí',
    auth_signup_as: 'Registrarse como',
    auth_credentials: 'Crea tus credenciales para continuar.',
    auth_email: 'Correo electrónico',
    auth_password: 'Contraseña',
    auth_confirm_password: 'Confirmar contraseña',
    auth_create_btn: 'Crear Cuenta',
    auth_welcome_back: 'Bienvenido de nuevo',
    auth_login_access: 'Inicia sesión para acceder a tu panel.',
    app_logged_as: 'Sesión iniciada como',
    app_sign_out: 'Cerrar sesión',
    landing_tagline: 'El Futuro del Reclutamiento Está Aquí',
    landing_title_line1: 'Entrevistas con IA.',
    landing_title_line2: 'Contratación Inteligente.',
    landing_subtitle:
      'Entrevistas en vídeo automatizadas, análisis conductual en tiempo real y generación instantánea de CV. Talent Finder conecta talento y empresas más rápido.',
    landing_company_btn: 'Soy Empresa',
    landing_applicant_btn: 'Soy Candidato',
    landing_how_title: 'Cómo Funciona',
    landing_how_sub: 'Tres pasos simples para tu próxima oportunidad.',
    how_title: 'Cómo Funciona',
    how_subtitle:
      'De la entrevista al insight: así nuestra IA transforma la experiencia de contratación para todos.',
    how_for_applicants: 'Para Candidatos',
    how_for_companies: 'Para Empresas',
    how_cta_title: '¿Listo para empezar?',
    how_cta_sub: 'Únete como candidato o incorpora tu empresa en minutos.',
    how_cta_applicant: 'Crear Cuenta de Candidato',
    how_cta_company: 'Crear Cuenta de Empresa',
  },
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useEffect(() => {
    const stored = localStorage.getItem(LANGUAGE_KEY) as LanguageCode | null;
    if (stored && translations[stored]) {
      setLanguageState(stored);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LANGUAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextType>(
    () => ({
      language,
      setLanguage: (lang) => setLanguageState(lang),
      t: (key, fallback) => translations[language][key] || fallback,
    }),
    [language]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextType => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside LanguageProvider');
  }
  return ctx;
};
