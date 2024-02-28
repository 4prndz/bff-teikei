import { Client } from "undici";

type Review = {
  product_id: String;
  user_id: String;
  star: String;
  comment: String;
};

export default class ReviewService {
  private client;

  constructor() {
    this.client = new Client("http://localhost:3002");
  }

  async getReviews(productId: string) {
    const response = await this.client.request({
      method: "GET",
      path: "/reviews",
      query: { product_id: productId },
    });

    const data = (await response.body.json()) as Review[];

    const reviews = [];

    for (const review of data) {
      reviews.push({
        user_id: review.user_id,
        start: review.user_id,
        comment: review.user_id,
      });
    }

    return reviews;
  }
}
