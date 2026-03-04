/**
 * Utility functions for formatting API responses.
 * This might be overkill?
 */

// ✅ Successful responses
type SuccessResponse = {
  success: true;
  message: string;
  data?: any;
};

export const sendSuccess = (
  res: any,
  message: string,
  data?: any,
  statusCode = 200,
) => {
  const response: SuccessResponse = { success: true, message };
  if (data !== undefined) response.data = data;
  return res.status(statusCode).json(response);
};

// ⚠️ Error responses
type ErrorResponse = {
  success: false;
  message: string;
  error?: any;
  devMessage?: string;
};

export const sendError = (
  res: any,
  message: string,
  error?: any,
  statusCode = 500,
  devMessage?: string,
) => {
  const response: ErrorResponse = { success: false, message };
  if (error !== undefined) response.error = error;

  // Only include dev message in non-production
  if (devMessage && process.env.NODE_ENV !== "production") {
    response.devMessage = devMessage;
  }

  return res.status(statusCode).json(response);
};
