import ProductService, { Product } from "../services/productService";
import ReviewService from "../services/reviewService";
import UserService from "../services/userService";

export default class ProductController {
  private productService;
  private reviewService;
  private userService;
  constructor() {
    this.productService = new ProductService();
    this.reviewService = new ReviewService();
    this.userService = new UserService();
  }

  async getProducts(): Promise<Product[]> {
    const products = await this.productService.getProducts();
    const productsfinal = [];
    if (!products.length) return [];

    for (const product of products) {
      const reviews = await this.reviewService.getReviews(product.id);
      const user = await this.userService.getUser(product.user_id);

      const totalstars = reviews.reduce((total, review) => {
        return total + review.star;
      }, 0);

      const averagestar = totalstars / reviews.length || 0;

      productsfinal.push({
        ...product,
        user_name: user.username,
        user_id: undefined,
        reviews_average_star: averagestar,
        reviews_quantities: reviews.length,
      });
    }

    return productsfinal;
  }

  async getProduct(id: string) {
    const product = await this.productService.getProduct(id);
    if (!Object.keys(product).length) return {};
    const reviews = await this.reviewService.getReviews(id);
    const user = await this.userService.getUser(product.user_id);

    const reviewsFinal = await Promise.all(
      reviews.map(async (review) => {
        const user = await this.userService.getUser(review.user_id);
        return {
          ...review,
          user_id: undefined,
          user: user.username,
        };
      }),
    );

    const totalstars = reviews.reduce((total, review) => {
      return total + review.star;
    }, 0);

    const averagestar = totalstars / reviews.length || 0;

    return {
      ...product,
      user_id: undefined,
      user: user.username,
      reviews_average_star: averagestar,
      reviews_quantities: reviews.length,
      reviews: reviewsFinal,
    };
  }
}
