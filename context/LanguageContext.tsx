import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import { initI18n, setLocale } from '../utils/i18n';

interface LanguageContextType {
  language: string;
  changeLanguage: (lang: string) => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'es',
  changeLanguage: async () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [language, setLanguageState] = useState('es');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      const locale = await initI18n();
      setLanguageState(locale);
      setLoading(false);
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (lang: string) => {
    await setLocale(lang);
    setLanguageState(lang);
  };

  if (loading) return null;

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);