// class AppError extends Error {
//   public statusCode: number;

//   constructor(statusCode: number, message: string, stack = "") {
//     super(message);
//     this.statusCode = statusCode;

//     if (stack) {
//       this.stack = stack;
//     } else {
//       Error.captureStackTrace(this, this.constructor);
//     }
//   }
// }

// export default AppError;

class AppError extends Error {
  public statusCode: number;
  public stack: string;
  constructor(statusCode: number, message: string, stack: string = "") {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack || "";
    if (!stack) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
export default AppError;
