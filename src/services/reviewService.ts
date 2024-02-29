import CircuitBreaker from "opossum";
import Http from "../utils/http";
import redis from "../utils/redis";

export type Review = {
  product_id: string;
  user_id: string;
  star: number;
  comment: string;
};

export default class ReviewService {
  private client;
  private cbGetReviews;

  constructor() {
    this.client = new Http("http://localhost:3002");
    this.cbGetReviews = new CircuitBreaker(
      async (productId: string) => {
        const key = `reviews:${productId}`;
        const staleKey = `reviews-stale:${productId}`;

        const dataFromCache = await redis.get(key);
        if (dataFromCache) {
          return JSON.parse(dataFromCache);
        }

        const response = await this.client.request(
          {
            method: "GET",
            path: "/reviews/",
            query: { product_id: productId },
          },
          { timeout: 5000 },
        );

        const reviews: Review[] = [];

        for (const review of response) {
          reviews.push({
            user_id: review.user_id,
            star: Number(review.star),
            comment: review.comment,
          } as Review);
        }

        await redis
          .pipeline()
          .set(key, JSON.stringify(reviews), "EX", 120)
          .set(staleKey, JSON.stringify(reviews), "EX", 36000)
          .exec();

        return reviews;
      },
      {
        timeout: 1000,
        errorThresholdPercentage: 10,
        resetTimeout: 10000,
      },
    );
    this.cbGetReviews.fallback(async (productId: string) => {
      const staleKey = `reviews-stale:${productId}`;
      const dataFromCache = await redis.get(staleKey);
      if (dataFromCache) {
        return JSON.parse(dataFromCache);
      }
      return [];
    });
  }

  async getReviews(productId: string) {
    console.log("Reviews");
    const { rejects, failures, fallbacks, successes } = this.cbGetReviews.stats;
    console.log({ rejects, failures, fallbacks, successes });
    return this.cbGetReviews.fire(productId);
  }
}
