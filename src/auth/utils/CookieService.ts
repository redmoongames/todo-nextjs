/**
 * Cookie Service
 * 
 * A utility service for managing cookies without third-party dependencies.
 * Provides methods for getting, setting, and removing cookies.
 */

export interface CookieOptions {
  path?: string;
  domain?: string;
  expires?: Date | number; // Date object or days as number
  secure?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

export class CookieService {
  /**
   * Get a cookie value by name
   * @param name The name of the cookie
   * @returns The cookie value or null if not found
   */
  public static get(name: string): string | null {
    if (typeof document === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Check if this cookie string begins with the name we want
      if (cookie.substring(0, name.length + 1) === `${name}=`) {
        return decodeURIComponent(cookie.substring(name.length + 1));
      }
    }
    return null;
  }

  /**
   * Set a cookie with the given name and value
   * @param name The name of the cookie
   * @param value The value of the cookie
   * @param options Cookie options (path, domain, expires, secure, sameSite)
   */
  public static set(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof document === 'undefined') return;
    
    const {
      path = '/',
      domain,
      expires,
      secure = false,
      sameSite = 'lax'
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // Add path
    cookieString += `; path=${path}`;
    
    // Add domain if specified
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    
    // Add expiration
    if (expires) {
      if (typeof expires === 'number') {
        // If expires is a number, interpret as days
        const date = new Date();
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000));
        cookieString += `; expires=${date.toUTCString()}`;
      } else {
        // If expires is a Date object
        cookieString += `; expires=${expires.toUTCString()}`;
      }
    }
    
    // Add secure flag
    if (secure) {
      cookieString += '; secure';
    }
    
    // Add SameSite
    cookieString += `; samesite=${sameSite}`;
    
    // Set the cookie
    document.cookie = cookieString;
  }

  /**
   * Remove a cookie by name
   * @param name The name of the cookie to remove
   * @param path The path of the cookie (must match the path used when setting)
   */
  public static remove(name: string, path = '/'): void {
    if (typeof document === 'undefined') return;
    
    // Set expiration to a past date to remove the cookie
    this.set(name, '', {
      path,
      expires: new Date(0), // Set to epoch time
    });
  }

  /**
   * Check if a cookie exists
   * @param name The name of the cookie
   * @returns True if the cookie exists, false otherwise
   */
  public static exists(name: string): boolean {
    return this.get(name) !== null;
  }

  /**
   * Parse a JSON cookie
   * @param name The name of the cookie
   * @returns The parsed JSON object or null if parsing fails
   */
  public static getJSON<T>(name: string): T | null {
    const value = this.get(name);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Error parsing JSON cookie ${name}:`, error);
      return null;
    }
  }

  /**
   * Set a JSON cookie
   * @param name The name of the cookie
   * @param value The object to stringify and store
   * @param options Cookie options
   */
  public static setJSON<T>(name: string, value: T, options: CookieOptions = {}): void {
    try {
      const jsonString = JSON.stringify(value);
      this.set(name, jsonString, options);
    } catch (error) {
      console.error(`Error stringifying JSON for cookie ${name}:`, error);
    }
  }
} 