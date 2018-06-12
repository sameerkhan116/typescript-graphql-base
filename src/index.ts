import "reflect-metadata";
import { GraphQLServer } from "graphql-yoga";
import { createConnection } from "typeorm";

import { ResolverMap } from "./types/ResolverTypes";
import { User } from "./entity/User";
import { Profile } from "./entity/Profile";

const typeDefs = `
  type User {
    id: Int!
    firstName: String!
    lastName: String!
    age: Int!
    email: String!
    profile: Profile!
  }
  
  type Profile {
    gender: String!
    photo: String!
  }

  type Query {
    hello(name: String): String!
    user(id: Int!): User!
    users: [User!]!
  }
  
  input ProfileInput {
    gender: String!
    photo: String!
  }
  
  type Mutation {
    createUser(firstName: String!, lastName: String!, age: Int!, email: String!, profile: ProfileInput): User!
    updateUser(id: Int!, firstName: String, lastName: String, age: String, email: String): Boolean
    deleteUser(id: Int!): Boolean
  }
`;

const resolvers: ResolverMap = {
  Mutation: {
    createUser: async (_, { profile, ...rest }) => {
      const profileCreate = await Profile.create(profile).save();
      const user = await User.create({
        ...rest,
        profileId: profileCreate.id,
      });
      user.profile = profileCreate;
      await user.save();
      return user;
    },
    deleteUser: async (_, { id }) => User.delete({ id }),
    updateUser: async (_, { id, ...args }) => User.save({ id, ...args }),
  },
  Query: {
    hello: (_, { name }) => `Hello ${name || "World"}`,
    user: async (_, { id }) =>
      User.findOne(id, {
        relations: ["profile"],
      }),
    users: async () => User.find({ relations: ["profile"] }),
  },
};

const server = new GraphQLServer({ typeDefs, resolvers });
createConnection().then(() => {
  server.start(() => console.log("Server is running on http://localhost:4000"));
});
