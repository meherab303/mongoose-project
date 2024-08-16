import mongoose, { CastError } from "mongoose";
import { TGenericReturnError } from "../errorInterface/TGenericReturnError";

const handleMongooseError = (
  err: mongoose.Error.ValidationError
): TGenericReturnError => {
  const statusCode = 400;

  const errorSource = Object.values(err?.errors).map(
    (errorField: mongoose.Error.ValidatorError | CastError) => {
      const path = errorField.path;
      const message = errorField.message;
      return {
        path,
        message,
      };
    }
  );

  return {
    statusCode,
    message: "Validation Error",
    errorSource,
  };
};
export default handleMongooseError;
