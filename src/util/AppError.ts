// Define a custom error class for application-specific errors
export class AppError extends Error {
  statusCode: number; // Property to hold the HTTP status code

  /**
   * Constructor to initialize the error message and status code.
   * @param message - A descriptive error message.
   * @param status - The HTTP status code associated with the error.
   */
  constructor(message: string, status: number) {
    super(message); // Call the parent class (Error) constructor with the message
    this.statusCode = status; // Assign the status code to the instance
  }
}
