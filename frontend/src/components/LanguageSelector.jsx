import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// variant="dark"  → pour les pages publiques (Landing, Login, Register)  — fond sombre
// variant="light" → pour les layouts connectés (headers d'app) — fond clair/glassmorphism
export default function LanguageSelector({ variant = 'light' }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦', isRTL: true }
  ];

  const currentLanguage =
    languages.find(lang => lang.code === (i18n.language || 'fr').split('-')[0]) || languages[0];

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    // Apply RTL direction for Arabic
    document.documentElement.dir = code === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    setIsOpen(false);
  };

  // Sync direction on mount (in case language was persisted in localStorage)
  useEffect(() => {
    const currentCode = (i18n.language || 'fr').split('-')[0];
    document.documentElement.dir = currentCode === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentCode;
  }, [i18n.language]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ─── Styles conditionnels selon le variant ───────────────────────────────────
  const triggerClass =
    variant === 'dark'
      ? // Pages publiques sombres — verre sombre
        'inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10 hover:border-white/20 focus:outline-none transition-all duration-200 shadow-lg'
      : // Layouts connectés — verre clair rosé
        'inline-flex items-center justify-between rounded-xl border border-rose-200/40 bg-white/70 backdrop-blur-md px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-white/95 focus:outline-none transition-all duration-200';

  const dropdownClass =
    variant === 'dark'
      ? 'absolute right-0 mt-2 w-44 rounded-xl bg-slate-900 shadow-2xl ring-1 ring-white/10 focus:outline-none z-50 border border-white/5 overflow-hidden'
      : 'absolute right-0 mt-2 w-44 rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-none z-50 border border-slate-100 overflow-hidden';

  const itemClass = (code) =>
    variant === 'dark'
      ? `flex items-center gap-2.5 w-full text-start px-4 py-3 text-sm transition-colors duration-150 ${
          i18n.language?.startsWith(code)
            ? 'bg-blue-600/20 text-blue-300 font-semibold'
            : 'text-slate-300 hover:bg-white/5 hover:text-white'
        }`
      : `flex items-center gap-2 w-full text-start px-4 py-2.5 text-sm transition-colors duration-150 ${
          i18n.language?.startsWith(code)
            ? 'bg-rose-50 text-rose-700 font-semibold'
            : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
        }`;

  const chevronClass =
    variant === 'dark'
      ? `ms-1 h-4 w-4 transform transition-transform duration-200 text-slate-400 ${isOpen ? 'rotate-180' : ''}`
      : `-me-1 ms-2 h-4 w-4 transform transition-transform duration-200 text-slate-500 ${isOpen ? 'rotate-180' : ''}`;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={triggerClass}
        id="language-menu-button"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-base">{currentLanguage.flag}</span>
        <span>{currentLanguage.label}</span>
        <svg
          className={chevronClass}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          className={dropdownClass}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu-button"
        >
          <div className="py-1" role="none">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={itemClass(lang.code)}
                role="menuitem"
              >
                <span className="text-base">{lang.flag}</span>
                <span>{lang.label}</span>
                {i18n.language?.startsWith(lang.code) && (
                  <span className={`ml-auto w-1.5 h-1.5 rounded-full ${variant === 'dark' ? 'bg-blue-400' : 'bg-rose-500'}`} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
