import CircuitBreaker from "opossum";
import Http from "../utils/http";
import redis from "../utils/redis";

type User = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  age: Number;
  gender: string;
  address: Address;
};

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
};

export default class UserService {
  private client;
  private cbGetUsers;
  private cbGetUser;

  constructor() {
    this.client = new Http("http://localhost:3003");
    this.cbGetUsers = new CircuitBreaker(
      async () => {
        const key = `users`;
        const staleKey = `users-stale`;

        const dataFromCache = await redis.get(key);
        if (dataFromCache) {
          return JSON.parse(dataFromCache);
        }

        const response = await this.client.request(
          {
            method: "GET",
            path: "/users",
          },
          { timeout: 5000 },
        );

        const users = [];

        for (const user of response) {
          users.push({
            id: user.id,
            username: user.username,
            email: user.email,
          });
        }

        await redis
          .pipeline()
          .set(key, JSON.stringify(users), "EX", 120)
          .set(staleKey, JSON.stringify(users), "EX", 36000)
          .exec();

        return users;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetUsers.fallback(async () => {
      const staleKey = `users-stale`;

      const dataFromCache = await redis.get(staleKey);
      if (dataFromCache) {
        return JSON.parse(dataFromCache);
      }
      return [];
    });
    this.cbGetUser = new CircuitBreaker(
      async (id: string) => {
        const key = `user:${id}`;
        const staleKey = `user-stale:${id}`;

        const dataFromCache = await redis.get(key);
        if (dataFromCache) {
          return JSON.parse(dataFromCache);
        }

        const response = await this.client.request(
          {
            method: "GET",
            path: `/users/${id}`,
          },
          { timeout: 5000 },
        );

        await redis
          .pipeline()
          .set(key, JSON.stringify(dataFromCache), "EX", 120)
          .set(staleKey, JSON.stringify(dataFromCache), "EX", 36000)
          .exec();

        return response;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetUser.fallback(async (id: string) => {
      const staleKey = `user-stale:${id}`;
      const dataFromCache = await redis.get(staleKey);
      if (dataFromCache) {
        return JSON.parse(dataFromCache);
      }
      return {};
    });
  }

  async getUsers() {
    console.log("Users");
    const { rejects, failures, fallbacks, successes } = this.cbGetUsers.stats;
    console.log({ rejects, failures, fallbacks, successes });
    return this.cbGetUsers.fire();
  }

  async getUser(id: string) {
    console.log("User");
    const { rejects, failures, fallbacks, successes } = this.cbGetUser.stats;
    console.log({ rejects, failures, fallbacks, successes });
    return this.cbGetUser.fire(id);
  }
}
