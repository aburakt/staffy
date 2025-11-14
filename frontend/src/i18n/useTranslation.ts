import { useAppStore } from '@/store/useAppStore';
import { translations } from './translations';

export function useTranslation() {
  const language = useAppStore((state) => state.language);

  const t = translations[language];

  return { t, language };
}
