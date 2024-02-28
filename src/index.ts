import { fastify, FastifyReply, FastifyRequest } from "fastify";

const server = fastify({
  logger: true,
});

server.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    test: "hello world",
  });
});

server.listen({ port: 3000 }, () => {
  console.log("Server running in http://localhost:3000");
});
