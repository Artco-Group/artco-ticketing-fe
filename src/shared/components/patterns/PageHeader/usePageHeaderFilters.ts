import { useLayoutEffect, useRef, useCallback } from 'react';
import { usePageHeaderContext } from './usePageHeaderContext';
import type { FilterBarConfig } from './pageHeaderContext';
import type { FilterPanelValues } from '../FilterBar';

export function usePageHeaderFilters(config: FilterBarConfig) {
  const { setFilterBarConfig } = usePageHeaderContext();
  const configRef = useRef(config);

  // Update ref in useLayoutEffect so it's always current when other effects run
  useLayoutEffect(() => {
    configRef.current = config;
  }, [config]);

  const stableOnFilterChange = useCallback(
    (filterId: string, value: string | null) => {
      configRef.current.onFilterChange?.(filterId, value);
    },
    []
  );

  const stableOnSortChange = useCallback((value: string | null) => {
    configRef.current.onSortChange?.(value);
  }, []);

  const stableOnFilterPanelChange = useCallback((value: FilterPanelValues) => {
    configRef.current.onFilterPanelChange?.(value);
  }, []);

  const stableOnViewChange = useCallback((mode: 'grid' | 'list') => {
    configRef.current.onViewChange?.(mode);
  }, []);

  const stableOnAddClick = useCallback(() => {
    configRef.current.onAddClick?.();
  }, []);

  // Create a stable update function that reads from ref
  const updateConfig = useCallback(() => {
    const current = configRef.current;
    setFilterBarConfig({
      filters: current.filters,
      onFilterChange: stableOnFilterChange,
      sortOptions: current.sortOptions,
      sortValue: current.sortValue,
      onSortChange: current.onSortChange ? stableOnSortChange : undefined,
      filterGroups: current.filterGroups,
      filterPanelValue: current.filterPanelValue,
      onFilterPanelChange: current.onFilterPanelChange
        ? stableOnFilterPanelChange
        : undefined,
      filterPanelSingleSelect: current.filterPanelSingleSelect,
      viewMode: current.viewMode,
      onViewChange: current.onViewChange ? stableOnViewChange : undefined,
      showFilter: current.showFilter,
      showAddButton: current.showAddButton,
      onAddClick: current.onAddClick ? stableOnAddClick : undefined,
    });
  }, [
    setFilterBarConfig,
    stableOnFilterChange,
    stableOnSortChange,
    stableOnFilterPanelChange,
    stableOnViewChange,
    stableOnAddClick,
  ]);

  // Initial setup and cleanup
  useLayoutEffect(() => {
    updateConfig();
    return () => setFilterBarConfig(undefined);
  }, [updateConfig, setFilterBarConfig]);

  // Update when primitive values change
  useLayoutEffect(() => {
    updateConfig();
  }, [
    config.sortValue,
    config.viewMode,
    config.showFilter,
    config.showAddButton,
    updateConfig,
  ]);

  // Update when filters array content changes (check length and values)
  const filtersKey = config.filters?.map((f) => `${f.id}:${f.value}`).join(',');
  useLayoutEffect(() => {
    updateConfig();
  }, [filtersKey, updateConfig]);

  // Update when filterPanelValue changes
  const filterPanelKey = config.filterPanelValue
    ? Object.entries(config.filterPanelValue)
        .map(([k, v]) => `${k}:${v.join(',')}`)
        .join('|')
    : '';
  useLayoutEffect(() => {
    updateConfig();
  }, [filterPanelKey, updateConfig]);
}
