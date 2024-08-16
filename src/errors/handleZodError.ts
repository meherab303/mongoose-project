import { ZodError, ZodIssue } from "zod";
import { TErrorSources } from "../errorInterface/errorInterface";
import { TGenericReturnError } from "../errorInterface/TGenericReturnError";

const handleZodError = (err: ZodError): TGenericReturnError => {
  const statusCode = 400;

  const errorSource: TErrorSources = err.issues.map((issue: ZodIssue) => {
    const path = issue.path[issue.path.length - 1];
    const message = issue.message;
    return {
      path,
      message,
    };
  });

  return {
    statusCode,
    message: "Validation error",
    errorSource,
  };
};
export default handleZodError;
