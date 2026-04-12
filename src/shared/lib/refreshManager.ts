export type RefreshCallback = (newAccessToken: string) => void;

export class RefreshManager {
  // Флаг для проверки, идет ли сейчас обновление токена
  private static isRefreshing = false;

  // Очередь на обновление токена
  private static queue: RefreshCallback[] = [];

  // Добавить запрос на обновление токена в очередь
  static enqueue(callback: RefreshCallback): void {
    this.queue.push(callback);
  }

  // Получаем новый токен и отдаем в очередь
  static resolveQueue(newAccessToken: string): void {
    this.queue.forEach((callback) => {
      callback(newAccessToken);
    });
    this.queue = [];
  }

  // Очистить очередь на обновление токена в результате ошибки обновления токена
  static rejectQueue(): void {
    this.queue = [];
  }

  // Проверка статуса обновления токена
  static get isRefreshInProgress(): boolean {
    return this.isRefreshing;
  }

  // Установить статус обновления токена
  static setRefreshingStatus(status: boolean): void {
    this.isRefreshing = status;
  }
}
