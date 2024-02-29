import TimeoutException from "./exceptions/TimeoutException";
import { setTimeout } from "timers/promises";
import { Client } from "undici";

type Signals = {
  cancelTimeout: AbortController;
  cancelRequest: AbortController;
};

export default class Http {
  private client;

  constructor(url: string) {
    this.client = new Client(url);
  }

  async request(params: any, { timeout }: { timeout: number }): Promise<any> {
    const cancelTimeout = new AbortController();
    const cancelRequest = new AbortController();

    try {
      const response = await Promise.race([
        this.makeRequest(params, { cancelTimeout, cancelRequest }),
        this.timeout(timeout, { cancelTimeout, cancelRequest }),
      ]);

      return response;
    } catch (error) {
      if (error instanceof TimeoutException) {
        throw error;
      }
    }

    throw Error;
  }

  private async makeRequest(
    params: any,
    { cancelTimeout, cancelRequest }: Signals,
  ) {
    try {
      const response = await this.client.request({
        ...params,
        throwOnError: true,
        signal: cancelRequest.signal,
      });

      const data = await response.body.json();

      return data;
    } finally {
      cancelTimeout.abort();
    }
  }

  private async timeout(
    delay: number,
    { cancelTimeout, cancelRequest }: Signals,
  ) {
    try {
      await setTimeout(delay, undefined, { signal: cancelTimeout.signal });
      cancelRequest.abort();
    } catch (error) {
      return;
    }

    throw TimeoutException;
  }
}
