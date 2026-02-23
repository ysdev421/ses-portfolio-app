export const normalizeDateString = (value) => {
  if (!value) return '';
  const normalized = String(value).trim().replace(/\./g, '/').replace(/-/g, '/');
  const m = normalized.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})$/);
  if (!m) return '';

  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  const dt = new Date(y, mo - 1, d);
  if (
    Number.isNaN(dt.getTime()) ||
    dt.getFullYear() !== y ||
    dt.getMonth() !== mo - 1 ||
    dt.getDate() !== d
  ) {
    return '';
  }

  return `${String(y).padStart(4, '0')}-${String(mo).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
};

export const parseDateInput = (value) => {
  const normalized = normalizeDateString(value);
  return normalized ? new Date(normalized) : null;
};

export const toSlashDate = (value) => (value || '').replace(/-/g, '/');

export const toYmd = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export const isActiveProject = (project) => {
  if (!project?.endDate) return true;
  return new Date(project.endDate) >= new Date();
};
