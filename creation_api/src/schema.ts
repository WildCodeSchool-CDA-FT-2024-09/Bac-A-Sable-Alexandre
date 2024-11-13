import { buildSchema } from "type-graphql";
import { RepoResolver } from "./repos/repo.resolvers";

export const getSchema = async () => {
  return await buildSchema({
    resolvers: [RepoResolver],
  });
};
