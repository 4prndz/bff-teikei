import CircuitBreaker from "opossum";
import Http from "../utils/http";

export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: Number;
  currency: string;
  availability: Boolean;
  description: string;
  features: string[];
  image_url: string;
  user_id: string;
};

export default class ProductService {
  private client;
  private cbGetProducts;
  private cbGetProduct;

  constructor() {
    this.client = new Http("http://localhost:3001");
    this.cbGetProducts = new CircuitBreaker(
      async () => {
        const response = await this.client.request(
          {
            method: "GET",
            path: "/products",
          },
          { timeout: 5000 },
        );

        const products = [];

        for (const product of response) {
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

        return products;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetProducts.fallback(() => {
      return [];
    });
    this.cbGetProduct = new CircuitBreaker(
      async (id: string) => {
        const response = await this.client.request(
          {
            method: "GET",
            path: `/products/${id}`,
          },
          { timeout: 5000 },
        );

        return response;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetProduct.fallback(() => {
      return {};
    });
  }

  async getProducts(): Promise<any[]> {
    console.log("Products:");
    const { rejects, failures, fallbacks, successes } =
      this.cbGetProducts.stats;
    console.log({ rejects, failures, fallbacks, successes });
    return this.cbGetProducts.fire();
  }

  async getProduct(id: string): Promise<Product> {
    console.log("Product");
    const { rejects, failures, fallbacks, successes } = this.cbGetProduct.stats;
    console.log({ rejects, failures, fallbacks, successes });
    return this.cbGetProduct.fire(id);
  }
}
