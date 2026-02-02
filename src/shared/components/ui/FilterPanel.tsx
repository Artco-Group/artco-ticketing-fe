import { useState, type ReactNode } from 'react';
import { cva } from 'class-variance-authority';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './dropdown-menu';
import { Icon } from './Icon';
import { FilterButton } from './filterButton';
import { cn } from '@/lib/utils';
import type { FilterOption } from '@/shared/components/common/FilterBar';

const filterPanelButtonVariants = cva(
  'inline-flex items-center gap-1.5 rounded-[10px] border px-2.5 py-1 text-[13px] font-medium tracking-[-0.28px] transition-colors duration-150 focus:outline-none',
  {
    variants: {
      active: {
        false:
          'bg-greyscale-100 border-dashed border-greyscale-200 text-greyscale-700 hover:bg-greyscale-100 active:bg-greyscale-200',
        true: 'bg-greyscale-100 border border-greyscale-300 text-greyscale-800 shadow-[0_0_0_1px_rgba(0,0,0,0.04)] hover:bg-greyscale-100 active:bg-greyscale-200',
      },
    },
    defaultVariants: {
      active: false,
    },
  }
);

export interface FilterGroup {
  key: string;
  label: string;
  icon?: ReactNode;
  options: FilterOption[];
  searchable?: boolean;
}

export interface FilterPanelValues {
  [key: string]: string[];
}

export interface FilterPanelProps {
  label?: string;
  icon?: ReactNode;
  groups: FilterGroup[];
  value?: FilterPanelValues;
  onChange?: (value: FilterPanelValues) => void;
  className?: string;
  /** When true, only one option can be selected per group */
  singleSelect?: boolean;
}

interface SearchableSubmenuProps {
  group: FilterGroup;
  selectedValues: string[];
  onCheckedChange: (optionValue: string, checked: boolean) => void;
}

function SearchableSubmenu({
  group,
  selectedValues,
  onCheckedChange,
}: SearchableSubmenuProps) {
  const [search, setSearch] = useState('');

  const filteredOptions = group.options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  );

  const showSearch = group.searchable !== false && group.options.length > 5;

  return (
    <>
      {showSearch && (
        <div className="border-greyscale-200 border-b px-2 pb-2">
          <div className="bg-greyscale-50 border-greyscale-200 flex items-center gap-2 rounded-md border px-2 py-1.5">
            <Icon name="search" size="sm" className="text-greyscale-400" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="placeholder:text-greyscale-400 w-full bg-transparent text-sm outline-none"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
            />
            {search && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSearch('');
                }}
                className="text-greyscale-400 hover:text-greyscale-600"
              >
                <Icon name="close" size="xs" />
              </button>
            )}
          </div>
        </div>
      )}
      <div className="max-h-[240px] overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="text-greyscale-500 px-2 py-3 text-center text-sm">
            No results found
          </div>
        ) : (
          filteredOptions.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) =>
                onCheckedChange(option.value, checked)
              }
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </div>
    </>
  );
}

export const FilterPanel = ({
  label,
  icon,
  groups,
  value = {},
  onChange,
  className,
  singleSelect = false,
}: FilterPanelProps) => {
  const [internalValue, setInternalValue] = useState<FilterPanelValues>({});

  const selectedValues = Object.keys(value).length > 0 ? value : internalValue;

  const totalSelected = Object.values(selectedValues).reduce(
    (sum, arr) => sum + arr.length,
    0
  );
  const isActive = totalSelected > 0;

  const handleCheckedChange = (
    groupKey: string,
    optionValue: string,
    checked: boolean
  ) => {
    let newGroupValues: string[];

    if (singleSelect) {
      newGroupValues = checked ? [optionValue] : [];
    } else {
      const currentGroupValues = selectedValues[groupKey] || [];
      newGroupValues = checked
        ? [...currentGroupValues, optionValue]
        : currentGroupValues.filter((v) => v !== optionValue);
    }

    const newValue = {
      ...selectedValues,
      [groupKey]: newGroupValues,
    };

    if (newGroupValues.length === 0) {
      delete newValue[groupKey];
    }

    if (Object.keys(value).length === 0 && !onChange) {
      setInternalValue(newValue);
    }

    onChange?.(newValue);
  };

  const handleRemoveFilter = (groupKey: string, optionValue: string) => {
    handleCheckedChange(groupKey, optionValue, false);
  };

  const getSelectedTags = () => {
    const tags: {
      groupKey: string;
      groupLabel: string;
      value: string;
      label: string;
    }[] = [];
    for (const [groupKey, values] of Object.entries(selectedValues)) {
      const group = groups.find((g) => g.key === groupKey);
      if (group) {
        for (const val of values) {
          const option = group.options.find((o) => o.value === val);
          if (option) {
            tags.push({
              groupKey,
              groupLabel: group.label,
              value: val,
              label: option.label,
            });
          }
        }
      }
    }
    return tags;
  };

  const selectedTags = getSelectedTags();

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-pressed={isActive}
            className={filterPanelButtonVariants({ active: false })}
          >
            {icon ? (
              <span className="inline-flex shrink-0 items-center">{icon}</span>
            ) : (
              <Icon name="filter" size="sm" />
            )}
            {label && <span>{label}</span>}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="min-w-[160px]">
          {groups.map((group) => {
            return (
              <DropdownMenuSub key={group.key}>
                <DropdownMenuSubTrigger className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    {group.icon && (
                      <span className="text-greyscale-500 inline-flex shrink-0 items-center">
                        {group.icon}
                      </span>
                    )}
                    <span>{group.label}</span>
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="max-w-[240px] min-w-[160px] p-0">
                  <div className="p-1">
                    <SearchableSubmenu
                      group={group}
                      selectedValues={selectedValues[group.key] || []}
                      onCheckedChange={(optionValue, checked) =>
                        handleCheckedChange(group.key, optionValue, checked)
                      }
                    />
                  </div>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedTags.map((tag) => (
        <FilterButton
          key={`${tag.groupKey}-${tag.value}`}
          label={tag.groupLabel}
          value={tag.label}
          active
          onRemove={() => handleRemoveFilter(tag.groupKey, tag.value)}
        />
      ))}
    </div>
  );
};

FilterPanel.displayName = 'FilterPanel';
