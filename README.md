# BFF - MarketPlace Example

This project is a learning exercise focusing on implementing a Back-End For Front-End (BFF) with Circuit Breaker and Cache mechanisms using Typescript, Node.js + Fastify, Opossum, and Redis.

## Purpose

This project aims to deepen understanding of fault-tolerance strategies and caching mechanisms in distributed systems.<br> It serves as a practical exploration of building resilient and performant applications, particularly in a microservices architecture.

## Features

Circuit Breaker: Prevents cascading failures by monitoring downstream services and opening the circuit if failures exceed a threshold. <br>
Cache with Redis: Improves performance by storing frequently accessed data in memory and serving it quickly without hitting the upstream services unnecessarily.

### Getting Started

`$ npm run start` <br>
`$ make products` <br>
`$ make users` <br>
`$ make reviews` <br>

### Example Routes (curl)

Get Users: `$ curl http://localhost:3000/users` <br>
Get User by ID: `$ curl http://localhost:3000/users/1` <br>
Get Products: `$ curl http://localhost:3000/products` <br>
Get Product by ID: `$ curl http://localhost:3000/Product/1` <br>

## To get started:

Clone the repository.<br>
Install dependencies with npm install.<br>
Configure Redis connection settings.<br>
Run the application with npm start.<br>

_ignore probability and potential errors, i am too shy >.<_
