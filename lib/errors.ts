export class AuthError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number = 401
  ) {
    super(message);
    this.name = "AuthError";
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor() {
    super("INVALID_CREDENTIALS", "Invalid credentials provided", 401);
    this.name = "InvalidCredentialsError";
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message = "Unauthorized") {
    super("UNAUTHORIZED", message, 403);
    this.name = "UnauthorizedError";
  }
}

export class NotFoundError extends AuthError {
  constructor(resource: string) {
    super("NOT_FOUND", `${resource} not found`, 404);
    this.name = "NotFoundError";
  }
}

export function handleAuthError(error: unknown) {
  if (error instanceof AuthError) {
    return {
      error: error.message,
      code: error.code,
      status: error.status,
    };
  }

  if (error instanceof Error) {
    return {
      error: error.message,
      code: "INTERNAL_ERROR",
      status: 500,
    };
  }

  return {
    error: "An unexpected error occurred",
    code: "UNKNOWN_ERROR",
    status: 500,
  };
}
