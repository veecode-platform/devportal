export class KongException extends Error {
  status: number;
  timestamp: string;

  constructor(message: string, status: number) {
    super(`kong-consumer: ${message}`);
    this.status = status;
    this.timestamp = new Date().toISOString();
  }
}
