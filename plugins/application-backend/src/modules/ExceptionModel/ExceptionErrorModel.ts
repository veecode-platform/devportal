
export class ErrorModel {
    status: string;
    message: string;
    httpCode: number



  constructor(status: string, message: string, httpCode: number) {
    this.status = status
    this.message = message
    this.httpCode = httpCode
  }




}