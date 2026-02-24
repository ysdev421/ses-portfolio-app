import { useRef } from 'react';
import { normalizeDateString, toSlashDate } from '../utils/date';

export default function CustomDateInput({
  value,
  onValueChange,
  placeholder = 'YYYY/MM/DD',
  required = false,
  className = '',
  inputClassName = '',
  buttonClassName = '',
}) {
  const nativeDateRef = useRef(null);

  const openPicker = () => {
    const input = nativeDateRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }
    input.click();
  };

  return (
    <div className={`relative flex items-center gap-2 ${className}`}>
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
        onClick={openPicker}
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
      <input
        ref={nativeDateRef}
        type="date"
        lang="ja"
        value={normalizeDateString(value) || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className="absolute right-0 top-1/2 h-9 w-16 -translate-y-1/2 opacity-0 pointer-events-none"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
