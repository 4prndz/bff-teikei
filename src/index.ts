import { fastify, FastifyReply, FastifyRequest } from "fastify";
import ProductController from "./controllers/productController";

interface ProductParams {
  id: string;
}

const productController = new ProductController();

const server = fastify({
  logger: true,
});

server.get("/products", async (_, reply: FastifyReply) => {
  const response = await productController.getProducts();
  return reply.send(response);
});

server.get(
  "/products/:id",
  async (
    req: FastifyRequest<{ Params: ProductParams }>,
    reply: FastifyReply,
  ) => {
    const id = req.params.id;
    const response = await productController.getProduct(id);
    return reply.send(response);
  },
);

server.listen({ port: 3000 }, () => {
  console.log("Server running in http://localhost:3000");
});
