import { TErrorSources } from "./errorInterface";

export type TGenericReturnError = {
  statusCode: number;
  message: string;
  errorSource: TErrorSources;
};
