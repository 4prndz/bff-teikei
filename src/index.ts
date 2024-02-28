import { FastifyReply, FastifyRequest } from "fastify";
import fastify from "fastify";

const server = fastify();

server.get("/", async (req: FastifyRequest, reply: FastifyReply) => {
  return reply.send({
    test: "hello world",
  });
});

server.listen({ port: 3000 }, () => {
  console.log("Server running in http://localhost:3000");
});
