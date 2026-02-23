import { useCallback, useRef, useState } from 'react';

export default function useToast(durationMs = 3000) {
  const [toast, setToast] = useState({ msg: '', type: '' });
  const timerRef = useRef(null);

  const showToast = useCallback((msg, type = 'success') => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setToast({ msg, type });
    timerRef.current = setTimeout(() => {
      setToast({ msg: '', type: '' });
      timerRef.current = null;
    }, durationMs);
  }, [durationMs]);

  return { toast, showToast };
}
