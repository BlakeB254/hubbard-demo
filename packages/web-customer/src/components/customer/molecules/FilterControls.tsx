'use client';

import { useState } from 'react';
import { Badge, Chip, Button, BottomSheet } from '@hubbard-inn/shared';
import { SlidersHorizontal } from 'lucide-react';

export interface FilterOptions {
  floor: 'all' | '1' | '2' | '3';
  ageRestriction: 'all' | 'none' | '18+' | '21+';
  status: 'all' | 'published' | 'sold_out';
}

export interface FilterControlsProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

function FilterContent({
  filters,
  onFilterChange,
}: FilterControlsProps) {
  const updateFilter = <K extends keyof FilterOptions>(
    key: K,
    value: FilterOptions[K]
  ) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-phi-5">
      {/* Floor Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-phi-3">
          Floor
        </label>
        <div className="flex flex-wrap gap-phi-2">
          {(['all', '1', '2', '3'] as const).map((floor) => (
            <button
              key={floor}
              onClick={() => updateFilter('floor', floor)}
              className={`px-phi-4 py-phi-3 rounded-phi-3 text-sm font-medium transition-all min-h-[44px] ${
                filters.floor === floor
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {floor === 'all' ? 'All Floors' : `Floor ${floor}`}
            </button>
          ))}
        </div>
      </div>

      {/* Age Restriction Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-phi-3">
          Age Restriction
        </label>
        <div className="flex flex-wrap gap-phi-2">
          {(['all', 'none', '18+', '21+'] as const).map((age) => (
            <button
              key={age}
              onClick={() => updateFilter('ageRestriction', age)}
              className={`px-phi-4 py-phi-3 rounded-phi-3 text-sm font-medium transition-all min-h-[44px] ${
                filters.ageRestriction === age
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {age === 'all' ? 'All Ages' : age === 'none' ? 'No Restriction' : age}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-phi-3">
          Availability
        </label>
        <div className="flex flex-wrap gap-phi-2">
          {(['all', 'published', 'sold_out'] as const).map((status) => (
            <button
              key={status}
              onClick={() => updateFilter('status', status)}
              className={`px-phi-4 py-phi-3 rounded-phi-3 text-sm font-medium transition-all min-h-[44px] ${
                filters.status === status
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status === 'all' ? 'All Events' : status === 'published' ? 'Available' : 'Sold Out'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FilterControls({ filters, onFilterChange }: FilterControlsProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const hasActiveFilters =
    filters.floor !== 'all' ||
    filters.ageRestriction !== 'all' ||
    filters.status !== 'all';

  const activeFilterCount = [
    filters.floor !== 'all',
    filters.ageRestriction !== 'all',
    filters.status !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFilterChange({ floor: 'all', ageRestriction: 'all', status: 'all' });
  };

  return (
    <>
      {/* Mobile Filter Button + Active Chips */}
      <div className="lg:hidden space-y-phi-3">
        <Button
          variant="outline"
          onClick={() => setMobileFiltersOpen(true)}
          className="w-full justify-between"
        >
          <span className="flex items-center gap-phi-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="primary">{activeFilterCount}</Badge>
            )}
          </span>
        </Button>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-phi-2">
            {filters.floor !== 'all' && (
              <Chip
                label={`Floor ${filters.floor}`}
                variant="primary"
                onRemove={() => onFilterChange({ ...filters, floor: 'all' })}
              />
            )}
            {filters.ageRestriction !== 'all' && (
              <Chip
                label={filters.ageRestriction}
                variant="primary"
                onRemove={() => onFilterChange({ ...filters, ageRestriction: 'all' })}
              />
            )}
            {filters.status !== 'all' && (
              <Chip
                label={filters.status === 'published' ? 'Available' : 'Sold Out'}
                variant="primary"
                onRemove={() => onFilterChange({ ...filters, status: 'all' })}
              />
            )}
            <button
              onClick={clearFilters}
              className="text-sm text-primary hover:underline px-phi-2"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter BottomSheet */}
      <BottomSheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        title="Filter Events"
        height="auto"
      >
        <FilterContent filters={filters} onFilterChange={onFilterChange} />
        <div className="mt-phi-5 flex gap-phi-3">
          <Button
            variant="outline"
            onClick={clearFilters}
            className="flex-1"
          >
            Clear All
          </Button>
          <Button
            variant="primary"
            onClick={() => setMobileFiltersOpen(false)}
            className="flex-1"
          >
            Apply Filters
          </Button>
        </div>
      </BottomSheet>

      {/* Desktop Filters */}
      <div className="hidden lg:block bg-card border border-border rounded-phi-4 p-phi-5">
        <FilterContent filters={filters} onFilterChange={onFilterChange} />

        {hasActiveFilters && (
          <div className="mt-phi-4 pt-phi-4 border-t border-border">
            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-phi-2">
                {filters.floor !== 'all' && (
                  <Badge variant="primary">Floor {filters.floor}</Badge>
                )}
                {filters.ageRestriction !== 'all' && (
                  <Badge variant="primary">{filters.ageRestriction}</Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="primary">
                    {filters.status === 'published' ? 'Available' : 'Sold Out'}
                  </Badge>
                )}
              </div>
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
