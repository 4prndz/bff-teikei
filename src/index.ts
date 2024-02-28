import { fastify, FastifyReply, FastifyRequest } from "fastify";
import ProductController from "./controllers/productController";
import UserController from "./controllers/userController";

interface IdParam {
  id: string;
}

const productController = new ProductController();
const userController = new UserController();

const server = fastify({
  logger: true,
});

server.get("/products", async (_, reply: FastifyReply) => {
  const response = await productController.getProducts();
  return reply.send(response);
});

server.get(
  "/products/:id",
  async (req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) => {
    const id = req.params.id;
    const response = await productController.getProduct(id);
    return reply.send(response);
  },
);

server.get("/users", async (_, reply: FastifyReply) => {
  const response = await userController.getUsers();
  return reply.send(response);
});

server.get(
  "/users/:id",
  async (req: FastifyRequest<{ Params: IdParam }>, reply: FastifyReply) => {
    const id = req.params.id;
    const response = await userController.getUser(id);
    return reply.send(response);
  },
);

server.listen({ port: 3000 }, () => {
  console.log("Server running in http://localhost:3000");
});
