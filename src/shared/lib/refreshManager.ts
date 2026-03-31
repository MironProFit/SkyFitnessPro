export type RefreshCallback = (newAccessToken: string) => void;

export class RefreshManager {
  //Флаг для проверки, идет ли сейчас обновление токена
  private static isRefrashing = true;

  //Очередь на обновление токена
  private static queue: RefreshCallback[] = [];

  //Добавить запрос на обновление токена в очередь
  static enqueue(callback: RefreshCallback): void {
    this.queue.push(callback);
  }

  //Получаем новый токен и отдаем в очередь
  static resolveQueue(newAccessToken: string): void {
    this.queue.forEach((callback) => {
      callback(newAccessToken);
    });
    this.queue = [];
  }
  //   Очистить очередь на обновление токена d результате ошибки обновления токена
  static rejectQueue(): void {
    this.queue = [];
  }
  //Проверка статуса обновления токена
  static get isRefrashInProgress(): boolean {
    return this.isRefrashing;
  }
  //Установить статус обновления токена
  static setRefrashingStatus(status: boolean) {
    this.isRefrashing = status;
  }
}
