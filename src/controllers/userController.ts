import UserService from "../services/userService";

export default class UserController {
  private userService;
  constructor() {
    this.userService = new UserService();
  }

  async getUsers() {
    const response = await this.userService.getUsers();
    if (!response.length) return {};
    return response;
  }

  async getUser(id: string) {
    const response = await this.userService.getUser(id);
    return response;
  }
}
