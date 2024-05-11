declare module "*.graphql" {
  import { DocumentNode, gql } from "@apollo/client";
  const content: DocumentNode;
  export default content;
}
