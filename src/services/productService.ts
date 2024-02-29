import CircuitBreaker from "opossum";
import Http from "../utils/http";
import redis from "../utils/redis";

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
        const key = "posts";
        const staleKey = "posts-stale";

        const dataFromCache = await redis.get(key);
        if (dataFromCache) {
          return JSON.parse(dataFromCache);
        }

        const response = await this.client.request(
          {
            method: "GET",
            path: "/products",
          },
          { timeout: 5000 },
        );

        const products: Product[] = [];

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
          } as Product);
        }

        await redis
          .pipeline()
          .set(key, JSON.stringify(products), "EX", 120)
          .set(staleKey, JSON.stringify(products), "EX", 36000)
          .exec();

        return products;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetProducts.fallback(async () => {
      const staleKey = "posts-stale";
      const dataFromCache = await redis.get(staleKey);
      if (dataFromCache) {
        return JSON.parse(dataFromCache);
      }
      return [];
    });
    this.cbGetProduct = new CircuitBreaker(
      async (id: string) => {
        const key = `post:${id}`;
        const staleKey = `post-stale:${id}`;

        const dataFromCache = await redis.get(key);
        if (dataFromCache) {
          return JSON.parse(dataFromCache);
        }

        const response: Product = await this.client.request(
          {
            method: "GET",
            path: `/products/${id}`,
          },
          { timeout: 5000 },
        );

        await redis
          .pipeline()
          .set(key, JSON.stringify(response), "EX", 120)
          .set(staleKey, JSON.stringify(response), "EX", 36000)
          .exec();

        return response;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetProduct.fallback(async (id: string) => {
      const staleKey = `post-stale:${id}`;
      const dataFromCache = await redis.get(staleKey);
      if (dataFromCache) {
        return JSON.parse(dataFromCache);
      }
      return {};
    });
  }

  async getProducts(): Promise<Product[]> {
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
