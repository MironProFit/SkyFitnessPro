//Общее хранилище токенов
export class TokenStorage {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  //Сохраняем оба токена в localstorage
  static setTokens(accessToken: string, refreshToken: string): void {
    (localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken),
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken));
  }
  //Обновляем только access токен
  static updateAccessToken(accessToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
  }
  //Получаем токен refresh
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }
  //Получаем токен access
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }
  //Очищаем токены
  static clear(): void {
    (localStorage.removeItem(this.ACCESS_TOKEN_KEY),
      localStorage.removeItem(this.REFRESH_TOKEN_KEY));
  }
  //Проверяем наличие токена access
  static isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}
