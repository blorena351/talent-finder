import React from 'react';
import { useI18n } from '../services/i18n';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useI18n();

  return (
    <label className="flex items-center gap-2 text-xs text-zinc-400">
      <span className="hidden sm:inline">{t('lang_label', 'Language')}</span>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="bg-zinc-900 border border-zinc-700 text-zinc-200 rounded px-2 py-1 outline-none"
      >
        <option value="en">English</option>
        <option value="pt-PT">Português (Portugal)</option>
        <option value="es">Español</option>
      </select>
    </label>
  );
};
