/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { TGenericReturnError } from "../errorInterface/TGenericReturnError";
import { TErrorSources } from "../errorInterface/errorInterface";

const handleMongooseDuplicateError = (err: any): TGenericReturnError => {
  const statusCode = 400;

  const errorReason = err?.message.match(/dup key: \{ name: "([^"]+)" \}/)?.[1];
  const errorFieldName = err?.message.match(/index: (\w+)_\d+ dup key:/)?.[1];
  const errorSource: TErrorSources = [
    {
      path: `${errorFieldName}`,
      message: `${errorReason} is already exist`,
    },
  ];
  return {
    statusCode,
    message: "Duplicate Error",
    errorSource,
  };
};
export default handleMongooseDuplicateError;
