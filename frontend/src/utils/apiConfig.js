const LIVE_API_URL = 'https://extremebeauty-e-booking-website.onrender.com';

export const isProductionBuild = process.env.NODE_ENV === 'production';

export const API_URL = isProductionBuild
  ? (process.env.REACT_APP_API_URL || LIVE_API_URL)
  : '';

// Base URL for the public site (home page). In production, default to the live
// deployed site so "View Site" always opens the populated public homepage. In
// development, use the local CRA origin (localhost:3000) which serves the SPA.
export const SITE_URL = isProductionBuild
  ? (process.env.REACT_APP_SITE_URL || LIVE_API_URL)
  : (window.location.origin || '');

export default API_URL;
