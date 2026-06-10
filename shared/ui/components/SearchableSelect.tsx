'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, CheckCircle2 } from 'lucide-react';

type SelectOption = string | { label: string; value: string; color?: string };

const getLabel = (option: SelectOption) => typeof option === 'string' ? option : option.label;
const getValue = (option: SelectOption) => typeof option === 'string' ? option : option.value;
const getColor = (option: SelectOption) => typeof option === 'string' ? undefined : option.color;

export function SearchableSelect<T extends SelectOption>({
  options,
  value,
  onChange,
  onSearch,
  isLoading = false,
  placeholder = "Seleccionar...",
  label,
  clearable = true,
  disabled = false,
  className = ""
}: {
  options: T[];
  value: string;
  onChange: (value: string) => void;
  onSearch?: (term: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  label?: string;
  clearable?: boolean;
  disabled?: boolean;
  className?: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [openUpwards, setOpenUpwards] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    onSearch?.(searchTerm);
  }, [searchTerm, onSearch]);

  React.useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setOpenUpwards(window.innerHeight - rect.bottom < 300);
    }
  }, [isOpen]);

  const selectedOption = React.useMemo(
    () => (options || []).find(opt => getValue(opt) === value),
    [options, value]
  );

  // Keep last known label so the display doesn't flash empty while async options reload
  const lastKnownLabel = React.useRef('');
  if (selectedOption) lastKnownLabel.current = getLabel(selectedOption);
  else if (!value) lastKnownLabel.current = '';

  const displayLabel = selectedOption ? getLabel(selectedOption) : lastKnownLabel.current;

  const filteredOptions = React.useMemo(
    () => (options || []).filter(opt =>
      getLabel(opt).toLowerCase().includes((searchTerm || '').toLowerCase())
    ),
    [options, searchTerm]
  );

  return (
    <div className={`relative space-y-2 ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`} ref={containerRef}>
      {label && <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>}
      <div className="relative">
        <div
          onClick={() => !disabled && setIsOpen(!isOpen)}
          className={`w-full px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent cursor-pointer flex justify-between items-center transition-all hover:bg-gray-100 dark:hover:bg-white/10 ${isOpen ? 'border-[#008080] ring-2 ring-[#008080]/10 shadow-lg shadow-[#008080]/5' : ''} ${disabled ? 'cursor-not-allowed' : ''}`}
        >
          <span className={value ? "text-sm dark:text-white font-medium" : "text-sm text-gray-400"}>
            {displayLabel || placeholder}
          </span>
          <div className="flex items-center gap-2">
            {clearable && value && (
              <button
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                <span className="text-[14px] leading-none">×</span>
              </button>
            )}
            <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
              <motion.div
                initial={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: openUpwards ? 10 : -10, scale: 0.95 }}
                className={`absolute z-50 w-full min-w-50 bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden ${openUpwards ? 'bottom-full mb-2' : 'mt-2'}`}
              >
                <div className="p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/2">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      autoFocus
                      type="text"
                      placeholder="Buscar..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-white/5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#008080]/20 border border-transparent focus:border-[#008080] dark:text-white transition-all"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar">
                  {isLoading ? (
                    <div className="px-4 py-10 text-center">
                      <div className="w-5 h-5 border-2 border-[#008080] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Buscando...</p>
                    </div>
                  ) : filteredOptions.length > 0 ? (
                    filteredOptions.map((option, idx) => {
                      const optValue = getValue(option);
                      const isSelected = value === optValue;
                      return (
                        <div
                          key={`${optValue}-${idx}`}
                          onClick={() => { onChange(optValue); setIsOpen(false); setSearchTerm(''); }}
                          className={`px-4 py-3 text-sm cursor-pointer rounded-xl transition-all flex items-center justify-between group ${
                            isSelected
                              ? 'bg-[#008080] text-white shadow-lg shadow-[#008080]/20'
                              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {getColor(option) && <div className={`w-2 h-2 rounded-full ${getColor(option)}`} />}
                            <span className="font-medium">{getLabel(option)}</span>
                          </div>
                          {isSelected && <CheckCircle2 size={14} className="text-white" />}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <p className="text-xs text-gray-400 italic mb-1">No se encontraron resultados</p>
                      <p className="text-[10px] text-gray-500">Intenta con otros términos</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
