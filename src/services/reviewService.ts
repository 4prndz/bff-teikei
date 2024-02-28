import { Client } from "undici";

export type Review = {
  product_id: String;
  user_id: String;
  star: Number;
  comment: String;
};

export default class ReviewService {
  private client;

  constructor() {
    this.client = new Client("http://localhost:3002");
  }

  async getReviews(productId: String) {
    const response = await this.client.request({
      method: "GET",
      path: "/reviews/",
      query: { product_id: productId },
    });

    const data = (await response.body.json()) as Review[];

    const reviews = [];

    for (const review of data) {
      reviews.push({
        user_id: review.user_id,
        star: Number(review.star),
        comment: review.comment,
      });
    }

    return reviews;
  }
}
