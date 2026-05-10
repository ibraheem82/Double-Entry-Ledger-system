export class BadRequestError extends Error {
  public readonly statusCode = 400;
  constructor(msg: string) { super(msg); Object.setPrototypeOf(this, BadRequestError.prototype); }
}
export class UnauthorizedError extends Error {
  public readonly statusCode = 401;
  constructor(msg: string) { super(msg); Object.setPrototypeOf(this, UnauthorizedError.prototype); }
}
export class ForbiddenError extends Error {
  public readonly statusCode = 403;
  constructor(msg: string) { super(msg); Object.setPrototypeOf(this, ForbiddenError.prototype); }
}
export class InternalServerError extends Error {
  public readonly statusCode = 500;
  constructor(msg: string) { super(msg); Object.setPrototypeOf(this, InternalServerError.prototype); }
}