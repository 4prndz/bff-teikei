import { Client } from "undici";

type Product = {
  id: String;
  name: String;
  brand: String;
  category: String;
  price: Number;
  currency: String;
  availability: Boolean;
  description: String;
  features: String[];
  image_url: String;
  user_id: Number;
};

export default class ProductService {
  private client;

  constructor() {
    this.client = new Client("http://localhost:3001");
  }

  async getProducts(): Promise<Product[]> {
    const response = await this.client.request({
      method: "GET",
      path: "/products",
    });

    const data = (await response.body.json()) as Product[];

    const products = [];

    for (const product of data) {
      products.push({
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        availability: product.availability,
        image_url: product.image_url,
        user_id: product.user_id,
      });
    }

    return data;
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.client.request({
      method: "GET",
      path: `/products/${id}`,
    });

    const data = (await response.body.json()) as Product;

    return data;
  }
}
