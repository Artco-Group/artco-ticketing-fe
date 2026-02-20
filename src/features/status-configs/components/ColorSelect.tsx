import * as SelectPrimitive from '@radix-ui/react-select';
import { cn } from '@/lib/utils';
import { Icon } from '@/shared/components/ui/Icon';
import type { StatusColor } from '@artco-group/artco-ticketing-sync';

const colorCssVariables: Record<StatusColor, string> = {
  gray: 'var(--color-greyscale-500)',
  slate: 'var(--color-greyscale-600)',
  blue: 'var(--icon-core)',
  green: 'var(--icon-success)',
  yellow: 'var(--badge-yellow)',
  orange: 'var(--badge-orange)',
  red: 'var(--icon-danger-default)',
  purple: 'var(--icon-component)',
  pink: 'var(--icon-support)',
  teal: 'var(--icon-info)',
};

const colorTailwindClasses: Record<StatusColor, string> = {
  gray: 'bg-gray-400',
  slate: 'bg-slate-500',
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-400',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  teal: 'bg-teal-500',
};

const colorKeys: Record<StatusColor, string> = {
  gray: 'gray',
  slate: 'slate',
  blue: 'blue',
  green: 'green',
  yellow: 'yellow',
  orange: 'orange',
  red: 'red',
  purple: 'purple',
  pink: 'pink',
  teal: 'teal',
};

interface ColorSwatchProps {
  color: StatusColor;
  size?: 'sm' | 'md';
  className?: string;
}

function ColorSwatch({ color, size = 'md', className }: ColorSwatchProps) {
  const sizeClasses = size === 'sm' ? 'h-3 w-3' : 'h-4 w-4';

  return (
    <span
      className={cn(
        'inline-block shrink-0 rounded-full ring-1 ring-black/10',
        sizeClasses,
        colorTailwindClasses[color],
        className
      )}
      style={{ backgroundColor: colorCssVariables[color] }}
    />
  );
}

interface ColorSelectProps {
  value: StatusColor;
  onChange: (value: StatusColor) => void;
  colors?: StatusColor[];
  className?: string;
  translate?: (key: string) => string;
}

export function ColorSelect({
  value,
  onChange,
  colors = Object.keys(colorCssVariables) as StatusColor[],
  className,
  translate,
}: ColorSelectProps) {
  const getColorLabel = (color: StatusColor) => {
    if (translate) {
      return translate(`workflows.colors.${colorKeys[color]}`);
    }
    return color.charAt(0).toUpperCase() + color.slice(1);
  };

  return (
    <SelectPrimitive.Root
      value={value}
      onValueChange={(v) => onChange(v as StatusColor)}
    >
      <SelectPrimitive.Trigger
        className={cn(
          'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring hover:bg-accent/50 flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 text-sm transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <ColorSwatch color={value} />
          <SelectPrimitive.Value asChild>
            <span className="truncate text-sm">{getColorLabel(value)}</span>
          </SelectPrimitive.Value>
        </div>
        <SelectPrimitive.Icon asChild>
          <Icon
            name="chevron-down"
            className="text-muted-foreground h-4 w-4 shrink-0"
          />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border shadow-lg"
          position="popper"
          sideOffset={4}
        >
          <SelectPrimitive.Viewport className="p-1.5">
            {colors.map((color) => (
              <SelectPrimitive.Item
                key={color}
                value={color}
                className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2.5 rounded-md py-2 pr-8 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
              >
                <ColorSwatch color={color} />
                <SelectPrimitive.ItemText>
                  {getColorLabel(color)}
                </SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className="absolute right-2 flex items-center justify-center">
                  <Icon name="check" className="text-primary h-4 w-4" />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
