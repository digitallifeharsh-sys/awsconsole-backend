// Shared SMS-module request filters.
export const normalizeNickname = value => String(value || '').trim().slice(0, 120);
