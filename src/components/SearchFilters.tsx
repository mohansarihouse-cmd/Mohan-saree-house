import React from 'react';
import { Filter, X, SlidersHorizontal, ArrowUpDown, Check, Sparkles, Tag } from 'lucide-react';
import { ProductCategory, Language } from '../types';
import { translations } from '../translations';

export interface FilterState {
  category: ProductCategory;
  type: string;
  color: string;
  priceRange: string;
  sortBy: 'trending' | 'highestRated' | 'priceLowHigh' | 'priceHighLow';
}

interface SearchFiltersProps {
  language: Language;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  availableTypes: string[];
  totalMatches: number;
}

export const COLOR_OPTIONS = [
  { id: 'all', labelEn: 'All Colors', labelHi: 'सभी रंग', hex: 'transparent' },
  { id: 'red', labelEn: 'Red / Crimson', labelHi: 'लाल / क्रिमसन', hex: '#b91c1c' },
  { id: 'maroon', labelEn: 'Deep Maroon', labelHi: 'गहरा मैरून', hex: '#831843' },
  { id: 'pink', labelEn: 'Blush Pink', labelHi: 'गुलाबी / पिंक', hex: '#ec4899' },
  { id: 'blue', labelEn: 'Peacock Blue', labelHi: 'नीला / मोरपंखी', hex: '#0284c7' },
  { id: 'green', labelEn: 'Emerald Green', labelHi: 'हरा / एमराल्ड', hex: '#059669' },
  { id: 'gold', labelEn: 'Mustard & Gold', labelHi: 'पीला / सुनहरा', hex: '#eab308' },
  { id: 'pastel', labelEn: 'Pastel Mint / Peach', labelHi: 'पेस्टल / मिंट', hex: '#14b8a6' },
];

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  language,
  filters,
  onFilterChange,
  onResetFilters,
  availableTypes,
  totalMatches,
}) => {
  const t = translations[language];

  const hasActiveFilters =
    filters.type !== 'all' ||
    filters.color !== 'all' ||
    filters.priceRange !== 'all' ||
    filters.category !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 mb-8 shadow-xs">
      
      {/* Top Bar: Category Pills + Sort Selector */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-stone-100">
        
        {/* Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-none">
          <button
            onClick={() => onFilterChange({ category: 'all' })}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filters.category === 'all'
                ? 'bg-rose-950 text-amber-100 shadow-sm ring-1 ring-amber-900/30'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {t.all}
          </button>

          <button
            onClick={() => onFilterChange({ category: 'saree' })}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filters.category === 'saree'
                ? 'bg-rose-950 text-amber-100 shadow-sm ring-1 ring-amber-900/30'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {t.sarees}
          </button>

          <button
            onClick={() => onFilterChange({ category: 'lehenga' })}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filters.category === 'lehenga'
                ? 'bg-rose-950 text-amber-100 shadow-sm ring-1 ring-amber-900/30'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            {t.lehengas}
          </button>

          <button
            onClick={() => onFilterChange({ category: 'bridal' })}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
              filters.category === 'bridal'
                ? 'bg-rose-950 text-amber-100 shadow-sm ring-1 ring-amber-900/30'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <span>{t.bridal}</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            </span>
          </button>
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 self-end lg:self-auto shrink-0">
          <ArrowUpDown className="w-4 h-4 text-stone-400" />
          <span className="text-xs text-stone-500 font-medium hidden sm:inline">{t.sortBy}:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value as any })}
            className="text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-800 cursor-pointer"
          >
            <option value="trending">{t.sortTrending}</option>
            <option value="highestRated">{t.sortHighestRated}</option>
            <option value="priceLowHigh">{t.sortPriceLowHigh}</option>
            <option value="priceHighLow">{t.sortPriceHighLow}</option>
          </select>
        </div>
      </div>

      {/* Filter Row: Type, Color & Price Dropdowns */}
      <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        
        {/* 1. Type / Fabric Filter */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Tag className="w-3 h-3 text-rose-800" />
            <span>{t.searchByType}</span>
          </label>
          <select
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 cursor-pointer"
          >
            <option value="all">{t.allTypes}</option>
            {availableTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Color Filter */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block"></span>
            <span>{t.searchByColor}</span>
          </label>
          <select
            value={filters.color}
            onChange={(e) => onFilterChange({ color: e.target.value })}
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 cursor-pointer"
          >
            {COLOR_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {language === 'hi' ? c.labelHi : c.labelEn}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Price Range Filter */}
        <div>
          <label className="block text-[11px] font-bold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <span className="text-amber-700 font-bold">₹</span>
            <span>{t.searchByPrice}</span>
          </label>
          <select
            value={filters.priceRange}
            onChange={(e) => onFilterChange({ priceRange: e.target.value })}
            className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-800/30 cursor-pointer"
          >
            <option value="all">{t.allPrices}</option>
            <option value="under25k">{t.priceUnder25k}</option>
            <option value="25k-50k">{t.price25kTo50k}</option>
            <option value="50k-80k">{t.price50kTo80k}</option>
            <option value="above80k">{t.priceAbove80k}</option>
          </select>
        </div>
      </div>

      {/* Active Filter Chips & Clear Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-stone-500 font-medium">
            <strong className="text-stone-900 font-bold">{totalMatches}</strong> {t.matchingItems}
          </span>

          {/* Active Type chip */}
          {filters.type !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-950 rounded-full border border-amber-300 text-[11px] font-semibold">
              <span>{filters.type}</span>
              <button
                onClick={() => onFilterChange({ type: 'all' })}
                className="hover:text-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Color chip */}
          {filters.color !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-950 rounded-full border border-rose-300 text-[11px] font-semibold">
              <span>
                {language === 'hi'
                  ? COLOR_OPTIONS.find((c) => c.id === filters.color)?.labelHi
                  : COLOR_OPTIONS.find((c) => c.id === filters.color)?.labelEn}
              </span>
              <button
                onClick={() => onFilterChange({ color: 'all' })}
                className="hover:text-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {/* Active Price chip */}
          {filters.priceRange !== 'all' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-950 rounded-full border border-emerald-300 text-[11px] font-semibold">
              <span>
                {filters.priceRange === 'under25k' && t.priceUnder25k}
                {filters.priceRange === '25k-50k' && t.price25kTo50k}
                {filters.priceRange === '50k-80k' && t.price50kTo80k}
                {filters.priceRange === 'above80k' && t.priceAbove80k}
              </span>
              <button
                onClick={() => onFilterChange({ priceRange: 'all' })}
                className="hover:text-red-700 cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-xs font-semibold text-rose-800 hover:text-rose-950 underline cursor-pointer"
          >
            {t.clearFilters}
          </button>
        )}
      </div>
    </div>
  );
};
