export interface IError {
  statusCode: string;
  message: Record<string, any>;
  error: Record<string, any>;
}