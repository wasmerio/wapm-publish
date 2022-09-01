/**
 * @fileoverview Apollo client
 */

//Imports
import "cross-fetch/polyfill";
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  NormalizedCacheObject,
} from "@apollo/client/core";
import { endGroup, error, setFailed, startGroup } from "@actions/core";
import { onError } from "@apollo/client/link/error";

export type Client = ApolloClient<NormalizedCacheObject>;

/**
 * Get the ApolloClient for a given WAPM registry
 * @param url WAPM registry url
 */
export const getClient = (registryUrl: string): Client => {
  // Instantiate the links

  const httpLink = new HttpLink({
    uri: `${registryUrl}/graphql`,
  });

  const errorLink = onError((res) => {
    if (res.graphQLErrors || res.networkError) {
      //Log errors
      startGroup("GraphQL errors");
      if (res.networkError != null) {
        error(res.networkError);
      }

      if (res.graphQLErrors != null) {
        for (const err of res.graphQLErrors) {
          error(err);
        }
      }
      endGroup();
    }
  });

  //Instantiate the Apollo client
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([errorLink, httpLink]),
  });
  return client;
};

//Export
export default getClient;
