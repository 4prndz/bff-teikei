import ProductService from "../services/productService";

export default class ProductController {
  private productService;
  constructor() {
    this.productService = new ProductService();
  }

  async getProducts() {
    const response = await this.productService.getProducts();
    return response;
  }

  async getProduct(id: string) {
    const response = await this.productService.getProduct(id);
    return response;
  }
}
