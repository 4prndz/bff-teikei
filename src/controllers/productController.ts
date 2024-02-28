import ProductService, { Product } from "../services/productService";
import ReviewService from "../services/reviewService";

export default class ProductController {
  private productService;
  private reviewService;
  constructor() {
    this.productService = new ProductService();
    this.reviewService = new ReviewService();
  }

  async getProducts(): Promise<any[]> {
    const products = await this.productService.getProducts();
    const productsfinal = [];

    for (const product of products) {
      const reviews = await this.reviewService.getReviews(product.id);

      const totalstars = reviews.reduce((total, review) => {
        return total + review.star;
      }, 0);

      const averagestar = totalstars / reviews.length || 0;

      productsfinal.push({
        ...product,
        reviews_average_star: averagestar,
        reviews_quantities: reviews.length,
      });
    }

    return productsfinal;
  }

  async getProduct(id: string) {
    const product = await this.productService.getProduct(id);

    const reviews = await this.reviewService.getReviews(id);

    const totalstars = reviews.reduce((total, review) => {
      return total + review.star;
    }, 0);

    const averagestar = totalstars / reviews.length || 0;

    return {
      ...product,
      reviews_average_star: averagestar,
      reviews_quantities: reviews.length,
      reviews,
    };
  }
}
