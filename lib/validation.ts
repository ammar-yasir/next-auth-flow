/**
 * Email validation
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Name validation
 */
export function isValidName(name: string): boolean {
  return name.trim().length >= 2 && name.trim().length <= 100;
}

/**
 * URL validation
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Provider validation
 */
export function isValidProvider(provider: string): boolean {
  const validProviders = ["google", "github", "linkedin"];
  return validProviders.includes(provider.toLowerCase());
}

/**
 * Session token validation
 */
export function isValidSessionToken(token: string): boolean {
  return token.length > 0 && token.length <= 256;
}

/**
 * Sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "");
}
