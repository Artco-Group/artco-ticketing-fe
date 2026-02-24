import { useLanguage } from '@/features/i18n/context';
import { useAppTranslation } from '@/shared/hooks';
import { Select } from '@/shared/components/ui';
import {
  SUPPORTED_LANGUAGES,
  LANGUAGE_OPTIONS,
  type SupportedLanguage,
} from '@/lib/i18n';

export function PreferenceSettings() {
  const { translate } = useAppTranslation('settings');
  const { language, setLanguage, isLoading } = useLanguage();

  const handleLanguageChange = (value: string) => {
    if (SUPPORTED_LANGUAGES.includes(value as SupportedLanguage)) {
      setLanguage(value as SupportedLanguage);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[540px]">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">
          {translate('preferences.title')}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          {translate('preferences.description')}
        </p>
      </div>

      <div className="space-y-8 rounded-lg border border-gray-200 bg-white p-6">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {translate('preferences.language.label')}
          </label>
          <Select
            options={LANGUAGE_OPTIONS}
            value={language}
            onChange={handleLanguageChange}
            disabled={isLoading}
          />
          <p className="mt-2 text-xs text-gray-500">
            {translate('preferences.language.description')}
          </p>
        </div>
      </div>
    </div>
  );
}
