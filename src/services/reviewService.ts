import Http from "../utils/http";

export type Review = {
  product_id: String;
  user_id: String;
  star: Number;
  comment: String;
};

export default class ReviewService {
  private client;

  constructor() {
    this.client = new Http("http://localhost:3002");
  }

  async getReviews(productId: String) {
    const response = await this.client.request(
      {
        method: "GET",
        path: "/reviews/",
        query: { product_id: productId },
      },
      { timeout: 5000 },
    );

    const reviews = [];

    for (const review of response) {
      reviews.push({
        user_id: review.user_id,
        star: Number(review.star),
        comment: review.comment,
      });
    }

    return reviews;
  }
}
