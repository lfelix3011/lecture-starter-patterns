class GenericError extends Error {
  public name: string;
  public userMessage: string;
  public internalMessage: string;

  constructor({ internalMessage, userMessage }: { internalMessage: string; userMessage: string }) {
    super(internalMessage);
    this.name = 'GenericError';
    this.userMessage = userMessage;
    this.internalMessage = internalMessage;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export { GenericError };
