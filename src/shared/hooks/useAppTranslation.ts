import { useTranslation } from 'react-i18next';

/**
 * Type for the translate function when passed as a prop
 */
export type TranslateFn = (
  key: string,
  options?: Record<string, unknown>
) => string;

type Namespace =
  | 'common'
  | 'auth'
  | 'errors'
  | 'tickets'
  | 'projects'
  | 'users'
  | 'clients'
  | 'subClients'
  | 'settings'
  | 'dashboard';

/**
 * Custom hook that wraps useTranslation with type-safe namespaces
 * and returns a cleaner API for use in components.
 *
 * @param namespace - The translation namespace to use (defaults to 'common')
 * @returns { translate, language } - Translation function and current language string
 *
 * @example
 * const { translate, language } = useAppTranslation('tickets');
 *
 * // Use in useMemo with language as dependency
 * const items = useMemo(() => [...], [translate, language]);
 */
export function useAppTranslation(namespace: Namespace = 'common') {
  const { t, i18n } = useTranslation(namespace);
  return { translate: t, language: i18n.language };
}
