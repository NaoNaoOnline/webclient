export default class Errors extends Error {
  // user is a UI/UX specific error message intended to address the user when an
  // intended action failed to execute. This error message is user friendly.
  public user: string;
  // tech is an engineering specific error instance intended to inform technical
  // support about symptoms and/or root causes of application malfunction. 
  public tech: Error;

  constructor(user: string, tech: Error) {
    super(user);
    this.user = user;
    this.tech = tech;
  }
}
