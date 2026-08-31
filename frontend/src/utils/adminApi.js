import { API_URL } from './apiConfig';

const TOKEN_KEY = 'eb_admin_token';
const ADMIN_KEY = 'eb_admin_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getAdmin = () => {
  try {
    return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null');
  } catch {
    return null;
  }
};
export const setAuth = (token, admin) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(admin));
};
export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
};

async function parseJson(response, context = 'request') {
  const contentType = response.headers.get('content-type');
  const text = await response.text();

  // TEMP DEBUG LOGS — remove after verifying
  console.groupCollapsed(`[api-debug] ${context} -> ${response.url}`);
  console.log('Request URL:', response.url);
  console.log('Response status:', response.status);
  console.log('Content-Type:', contentType);
  console.log('Response body:', text.slice(0, 500));
  console.groupEnd();

  if (!contentType || !contentType.includes('application/json')) {
    console.error(`[api] Expected JSON but received content-type "${contentType}". Body (first 300 chars):`, text.slice(0, 300));
    throw new Error('Server returned an invalid response. Please check the API endpoint and try again.');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    console.error(`[api] Could not parse JSON for '${response.url}'. Body:`, text.slice(0, 300));
    throw new Error('Server returned an invalid response. Please check the API endpoint and try again.');
  }
}

export async function fetchJson(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  const json = await parseJson(response, path);

  if (response.status === 401) {
    if (json && json.message) {
      throw new Error(json.message);
    }
    clearAuth();
    throw new Error('Session expired. Please log in again.');
  }

  if (!response.ok) {
    throw new Error(json.message || 'Request failed');
  }

  return json.data !== undefined ? json.data : json;
}

export const requestJson = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const json = await parseJson(response, path);
  if (!response.ok) {
    throw new Error(json.message || 'Request failed');
  }
  return json;
};

export const adminFetch = fetchJson;

export default API_URL;
