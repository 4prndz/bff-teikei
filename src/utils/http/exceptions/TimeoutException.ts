export default class TimeoutException extends Error {
  constructor() {
    super("Timeout Exceeded");
  }
}
