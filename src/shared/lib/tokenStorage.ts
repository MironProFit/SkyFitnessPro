export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_CACHE_KEY = 'user_cache';

  static setTokens(accessToken: string, refreshToken: string, userEmail?: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    if (userEmail) {
      localStorage.setItem(this.USER_CACHE_KEY, userEmail);
    }
  }

  static updateAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }

  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  static getCachedUserEmail(): string | null {
    return localStorage.getItem(this.USER_CACHE_KEY);
  }

  static clear(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_CACHE_KEY); 
    localStorage.removeItem(this.USER_CACHE_KEY); 
  }

  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}