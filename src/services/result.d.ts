type ResultSuccess<T> = { type: "success"; value: T };

type ResultError = { type: "error"; error: ErrorResponse };

type Result<T> = ResultSuccess<T> | ResultError;

type RequestResult<T> = {
  metadata: any;
  result: T;
};

type ErrorResponse = {
  status: number;
  name: string;
  message: string;
};
