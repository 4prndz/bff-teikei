import { Client } from "undici";

type User = {
  id: String;
  username: String;
  email: String;
  first_name: String;
  last_name: String;
  age: Number;
  gender: String;
  address: Address;
};

type Address = {
  street: String;
  city: String;
  state: String;
  country: String;
  postal_code: String;
};

export default class UserService {
  private client;

  constructor() {
    this.client = new Client("http://localhost:3003");
  }

  async getUsers() {
    const response = await this.client.request({
      method: "GET",
      path: "/users",
    });

    const data = (await response.body.json()) as User[];

    const users = [];

    for (const user of data) {
      users.push({
        id: user.id,
        username: user.username,
        email: user.email,
      });
    }

    return users;
  }

  async getUser(id: string) {
    const response = await this.client.request({
      method: "GET",
      path: `/users/${id}`,
    });

    const data = (await response.body.json()) as User;

    return data;
  }
}
