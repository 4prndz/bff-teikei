import Http from "../utils/http";

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
    this.client = new Http("http://localhost:3003");
  }

  async getUsers() {
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

    return users;
  }

  async getUser(id: String) {
    const response = await this.client.request(
      {
        method: "GET",
        path: `/users/${id}`,
      },
      { timeout: 5000 },
    );

    return response;
  }
}
