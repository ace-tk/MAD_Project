// Use environment variable if set, otherwise default to empty string (offline mode)
// On mobile devices, localhost won't work - use your computer's IP address instead
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || '';
export const DEFAULT_USER_ID = 'demo-user';
