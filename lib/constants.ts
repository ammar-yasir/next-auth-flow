// OAuth Provider Constants
export const OAUTH_PROVIDERS = {
  GOOGLE: "google",
  GITHUB: "github",
  LINKEDIN: "linkedin",
} as const;

export const PROVIDER_NAMES = {
  [OAUTH_PROVIDERS.GOOGLE]: "Google",
  [OAUTH_PROVIDERS.GITHUB]: "GitHub",
  [OAUTH_PROVIDERS.LINKEDIN]: "LinkedIn",
} as const;

// Route Constants
export const PUBLIC_ROUTES = [
  "/",
  "/auth/signin",
  "/auth/signup",
  "/terms",
  "/privacy",
];

export const PROTECTED_ROUTES = ["/dashboard"];

// Session Constants
export const SESSION_DURATION = 30 * 24 * 60 * 60; // 30 days in seconds

// Error Messages
export const AUTH_ERRORS = {
  PROVIDER_NOT_CONFIGURED: "Provider is not configured",
  INVALID_CREDENTIALS: "Invalid credentials provided",
  ACCOUNT_NOT_FOUND: "Account not found",
  SESSION_EXPIRED: "Your session has expired. Please sign in again.",
  UNAUTHORIZED: "You are not authorized to access this resource",
} as const;

// Success Messages
export const AUTH_MESSAGES = {
  SIGN_IN_SUCCESS: "Signed in successfully",
  SIGN_OUT_SUCCESS: "Signed out successfully",
  PROFILE_UPDATED: "Profile updated successfully",
} as const;
