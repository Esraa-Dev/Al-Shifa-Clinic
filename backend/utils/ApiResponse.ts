interface IApiResponse<T> {
  success: boolean;       
  statusCode: number;     
  message: string;       
  data: T | null;       
  errors?: any;        
}
export class ApiResponse<T> implements IApiResponse<T> {
  public success = true;
  public statusCode: number;
  public message: string;
  public data: T | null;
  
  constructor(message: string, data: T | null = null, statusCode: number = 200) {
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
  }
}
