import { useTranslation } from 'react-i18next';
import { useToast, type ToastOptions } from '@/shared/components/ui/Toast';

type TranslationOptions = Record<string, string | number>;

interface TranslatedToastOptions {
  titleKey: string;
  titleOptions?: TranslationOptions;
  messageKey?: string;
  messageOptions?: TranslationOptions;
  duration?: number;
}

/**
 * Custom hook that provides translated toast notifications.
 * Wraps useToast with useTranslation for automatic language support.
 *
 * @example
 * const toast = useTranslatedToast();
 *
 * // Simple usage with just a translation key
 * toast.success('toast.success.updated', { item: 'Ticket' });
 *
 * // Full options with title and message
 * toast.error({
 *   titleKey: 'toast.error.failedTo',
 *   titleOptions: { action: 'update status' },
 *   messageKey: 'toast.error.tryAgain'
 * });
 */
export function useTranslatedToast() {
  const { t } = useTranslation('common');
  const toast = useToast();

  const createTranslatedToast =
    (type: 'success' | 'error' | 'warning' | 'info') =>
    (
      keyOrOptions: string | TranslatedToastOptions,
      interpolationOptions?: TranslationOptions
    ): string => {
      if (typeof keyOrOptions === 'string') {
        return toast[type](t(keyOrOptions, interpolationOptions));
      }

      const options: ToastOptions = {
        title: t(keyOrOptions.titleKey, keyOrOptions.titleOptions),
        message: keyOrOptions.messageKey
          ? t(keyOrOptions.messageKey, keyOrOptions.messageOptions)
          : undefined,
        duration: keyOrOptions.duration,
      };

      return toast[type](options);
    };

  return {
    success: createTranslatedToast('success'),
    error: createTranslatedToast('error'),
    warning: createTranslatedToast('warning'),
    info: createTranslatedToast('info'),
    dismiss: toast.dismiss,
  };
}
