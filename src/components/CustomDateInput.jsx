import { useEffect, useMemo, useRef, useState } from 'react';
import { normalizeDateString, toSlashDate, toYmd } from '../utils/date';

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const toDate = (value) => {
  const normalized = normalizeDateString(value);
  return normalized ? new Date(`${normalized}T00:00:00`) : null;
};

const isSameDate = (a, b) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);

const addMonths = (date, amount) => new Date(date.getFullYear(), date.getMonth() + amount, 1);

const buildCalendarCells = (displayMonth) => {
  const firstDay = startOfMonth(displayMonth);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(displayMonth.getFullYear(), displayMonth.getMonth() + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) {
    cells.push(new Date(displayMonth.getFullYear(), displayMonth.getMonth(), d));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

export default function CustomDateInput({
  value,
  onValueChange,
  placeholder = 'YYYY/MM/DD',
  required = false,
  className = '',
  inputClassName = '',
  buttonClassName = '',
}) {
  const containerRef = useRef(null);
  const selectedDate = useMemo(() => toDate(value), [value]);
  const [open, setOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(() => selectedDate || new Date());

  useEffect(() => {
    if (selectedDate) setDisplayMonth(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  const monthLabel = `${displayMonth.getFullYear()}年 ${displayMonth.getMonth() + 1}月`;
  const cells = buildCalendarCells(displayMonth);

  const handleSelect = (date) => {
    onValueChange(toYmd(date));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative flex items-center gap-2 ${className}`}>
      <input
        type="text"
        value={toSlashDate(value)}
        onChange={(e) => onValueChange(e.target.value)}
        inputMode="numeric"
        pattern="\d{4}/\d{1,2}/\d{1,2}"
        placeholder={placeholder}
        required={required}
        className={inputClassName}
      />

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={buttonClassName}
        aria-label="カレンダーを開く"
        title="カレンダーを開く"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+0.5rem)] z-50 w-72 rounded-xl border border-slate-700 bg-slate-900/95 shadow-2xl backdrop-blur p-3">
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              className="h-8 w-8 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
              onClick={() => setDisplayMonth((prev) => addMonths(prev, -1))}
              aria-label="前の月"
            >
              ‹
            </button>
            <div className="text-sm font-semibold text-amber-300">{monthLabel}</div>
            <button
              type="button"
              className="h-8 w-8 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200"
              onClick={() => setDisplayMonth((prev) => addMonths(prev, 1))}
              aria-label="次の月"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-1">
            {WEEKDAYS.map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((date, idx) => {
              if (!date) return <div key={`blank-${idx}`} className="h-9" />;

              const isSelected = isSameDate(date, selectedDate);
              const isToday = isSameDate(date, new Date());

              return (
                <button
                  key={toYmd(date)}
                  type="button"
                  onClick={() => handleSelect(date)}
                  className={[
                    'h-9 rounded-md text-sm transition-colors',
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-200 hover:bg-slate-700',
                    isToday && !isSelected ? 'ring-1 ring-amber-500/60' : '',
                  ].join(' ')}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onValueChange('');
                setOpen(false);
              }}
              className="flex-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2"
            >
              クリア
            </button>
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                onValueChange(toYmd(today));
                setDisplayMonth(today);
                setOpen(false);
              }}
              className="flex-1 rounded-md bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs py-2"
            >
              今日
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
