import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";
import "reflect-metadata";

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || "World"}`,
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on http://localhost:4000"));
});
