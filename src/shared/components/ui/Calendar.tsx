import type { ComponentProps } from 'react';
import {
  DayPicker,
  type PropsSingle,
  type PropsMulti,
  type PropsRange,
} from 'react-day-picker';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { enUS, bs } from 'date-fns/locale';
import { getYear } from 'date-fns';
import type { Locale } from 'date-fns';
import { cn } from '@/lib/utils';
import { buttonVariants } from './Button';

const currentYear = getYear(new Date());
const startYear = currentYear - 10;
const endYear = currentYear + 10;

const localeMap: Record<string, Locale> = {
  en: enUS,
  bs: bs,
};

type BaseCalendarProps = Omit<
  ComponentProps<typeof DayPicker>,
  'locale' | 'mode' | 'selected' | 'onSelect' | 'required'
> & {
  locale?: string;
};

export type CalendarProps = BaseCalendarProps &
  (PropsSingle | PropsMulti | PropsRange | { mode?: undefined });

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  locale = 'en',
  ...props
}: CalendarProps) {
  const dateFnsLocale = localeMap[locale] || enUS;
  const isRangeMode = 'mode' in props && props.mode === 'range';

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      locale={dateFnsLocale}
      captionLayout="dropdown"
      startMonth={new Date(startYear, 0)}
      endMonth={new Date(endYear, 11)}
      className={cn('p-3', className)}
      classNames={{
        months: 'flex flex-col sm:flex-row gap-2',
        month: 'flex flex-col gap-4',
        month_caption: 'flex items-center justify-center gap-2',
        caption_label: 'hidden',
        dropdowns: 'flex items-center gap-1',
        dropdown: cn(
          'appearance-none bg-transparent text-sm font-medium cursor-pointer',
          'border border-input rounded-md px-2 py-1',
          'hover:bg-accent focus:outline-none focus:ring-1 focus:ring-ring'
        ),
        nav: 'hidden',
        button_previous: 'hidden',
        button_next: 'hidden',
        month_grid: 'w-full border-collapse space-x-1',
        weekdays: 'flex',
        weekday:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        week: 'flex w-full mt-2',
        day: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md',
          isRangeMode
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md'
            : '[&:has([aria-selected])]:rounded-md'
        ),
        day_button: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100'
        ),
        range_start: 'day-range-start rounded-l-md',
        range_end: 'day-range-end rounded-r-md',
        selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-muted-foreground aria-selected:text-muted-foreground',
        disabled: 'text-muted-foreground opacity-50',
        range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) => {
          const Icon = orientation === 'left' ? ChevronLeft : ChevronRight;
          return <Icon className="h-4 w-4" />;
        },
      }}
      {...(props as ComponentProps<typeof DayPicker>)}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
