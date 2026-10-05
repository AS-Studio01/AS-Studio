import React, { createContext, useContext, useState, useEffect } from 'react';

export type LanguageCode = 'en' | 'hi' | 'de' | 'ja' | 'fr' | 'es';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🌐' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

const TRANSLATIONS: Record<LanguageCode, Record<string, string>> = {
  en: {
    nav_home: 'Home',
    nav_work: 'Work',
    nav_services: 'Services',
    nav_process: 'Process',
    nav_contact: 'Contact',
    nav_helper_ai: 'Helper AI',
    nav_login: 'Sign In / Login',
    nav_account: 'Account',
    nav_start_project: 'Start project',
    badge_studio: 'Digital Studio',
    tagline_hero: 'Clean digital experiences for businesses ready to be easier to choose.',
    hero_cta_primary: 'Start a project',
    hero_cta_secondary: 'Selected Work',
    contact_guarantee: 'Response within 24 hours guaranteed',
    rating_verified_only: 'Only clients who have purchased our service can submit a verified review.',
    language_select: 'Language',
  },
  hi: {
    nav_home: 'होम',
    nav_work: 'कार्य',
    nav_services: 'सेवाएं',
    nav_process: 'प्रक्रिया',
    nav_contact: 'संपर्क',
    nav_helper_ai: 'हेल्पर AI',
    nav_login: 'साइन इन करें',
    nav_account: 'खाता',
    nav_start_project: 'प्रोजेक्ट शुरू करें',
    badge_studio: 'डिजिटल स्टूडियो',
    tagline_hero: 'व्यवसायों के लिए स्पष्ट डिजिटल अनुभव ताकि ग्राहक उन्हें आसानी से चुन सकें।',
    hero_cta_primary: 'प्रोजेक्ट शुरू करें',
    hero_cta_secondary: 'चुने गए कार्य देखें',
    contact_guarantee: '24 घंटे के भीतर उत्तर की गारंटी',
    rating_verified_only: 'केवल वे ग्राहक जिन्होंने हमारी सेवा खरीदी है, सत्यापित समीक्षा दे सकते हैं।',
    language_select: 'भाषा चुनें',
  },
  de: {
    nav_home: 'Startseite',
    nav_work: 'Projekte',
    nav_services: 'Leistungen',
    nav_process: 'Prozess',
    nav_contact: 'Kontakt',
    nav_helper_ai: 'KI-Assistent',
    nav_login: 'Anmelden',
    nav_account: 'Konto',
    nav_start_project: 'Projekt starten',
    badge_studio: 'Digitales Studio',
    tagline_hero: 'Klare digitale Erlebnisse für Unternehmen, die leichter gewählt werden wollen.',
    hero_cta_primary: 'Projekt starten',
    hero_cta_secondary: 'Ausgewählte Arbeiten',
    contact_guarantee: 'Antwort garantiert innerhalb von 24 Stunden',
    rating_verified_only: 'Nur Kunden, die unseren Service erworben haben, können eine verifizierte Bewertung abgeben.',
    language_select: 'Sprache',
  },
  ja: {
    nav_home: 'ホーム',
    nav_work: '実績',
    nav_services: 'サービス',
    nav_process: 'プロセス',
    nav_contact: 'お問い合わせ',
    nav_helper_ai: 'AIアシスタント',
    nav_login: 'ログイン',
    nav_account: 'アカウント',
    nav_start_project: 'プロジェクト相談',
    badge_studio: 'デジタルスタジオ',
    tagline_hero: '顧客に選ばれやすい明瞭で美しいデジタル体験を創り出します。',
    hero_cta_primary: 'プロジェクトを始める',
    hero_cta_secondary: '実績ギャラリー',
    contact_guarantee: '24時間以内の返答を保証',
    rating_verified_only: '当スタジオのサービスをご利用いただいたクライアント様のみ公式評価が可能です。',
    language_select: '言語',
  },
  fr: {
    nav_home: 'Accueil',
    nav_work: 'Réalisations',
    nav_services: 'Services',
    nav_process: 'Processus',
    nav_contact: 'Contact',
    nav_helper_ai: 'Assistant IA',
    nav_login: 'Se connecter',
    nav_account: 'Compte',
    nav_start_project: 'Démarrer un projet',
    badge_studio: 'Studio Digital',
    tagline_hero: 'Des expériences numériques épurées pour les entreprises prêtes à être choisies plus facilement.',
    hero_cta_primary: 'Démarrer un projet',
    hero_cta_secondary: 'Découvrir nos projets',
    contact_guarantee: 'Réponse garantie sous 24 heures',
    rating_verified_only: 'Seuls les clients ayant acheté nos services peuvent publier un avis certifié.',
    language_select: 'Langue',
  },
  es: {
    nav_home: 'Inicio',
    nav_work: 'Proyectos',
    nav_services: 'Servicios',
    nav_process: 'Proceso',
    nav_contact: 'Contacto',
    nav_helper_ai: 'Asistente IA',
    nav_login: 'Iniciar sesión',
    nav_account: 'Cuenta',
    nav_start_project: 'Iniciar proyecto',
    badge_studio: 'Estudio Digital',
    tagline_hero: 'Experiencias digitales limpias para negocios que quieren ser más fáciles de elegir.',
    hero_cta_primary: 'Iniciar proyecto',
    hero_cta_secondary: 'Ver proyectos',
    contact_guarantee: 'Respuesta garantizada en 24 horas',
    rating_verified_only: 'Solo los clientes que hayan adquirido nuestros servicios pueden enviar una reseña verificada.',
    language_select: 'Idioma',
  },
};

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageOption[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('as_studio_language') as LanguageCode;
      if (saved && TRANSLATIONS[saved]) return saved;
      const browserLang = navigator.language.slice(0, 2) as LanguageCode;
      if (TRANSLATIONS[browserLang]) return browserLang;
    }
    return 'en';
  });

  const setLanguage = (lang: LanguageCode) => {
    setCurrentLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('as_studio_language', lang);
      document.documentElement.lang = lang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  const t = (key: string, fallback?: string): string => {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS['en'][key] || fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLanguage,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
