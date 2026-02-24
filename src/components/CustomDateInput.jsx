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
    <div className={`flex items-center gap-2 ${className}`}>
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
      >
        日付
      </button>
      <input
        ref={nativeDateRef}
        type="date"
        lang="ja"
        value={normalizeDateString(value) || ''}
        onChange={(e) => onValueChange(e.target.value)}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
}
