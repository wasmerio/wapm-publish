/**
 * @fileoverview Apollo client
 */

//Imports
import 'cross-fetch/polyfill';
import {ApolloClient, InMemoryCache, HttpLink, from} from '@apollo/client/core';
import {endGroup, error, setFailed, startGroup} from '@actions/core';
import {onError} from '@apollo/client/link/error';

//Instantiate the links
const httpLink = new HttpLink({
  uri: 'https://registry.wapm.io/graphql'
});

const errorLink = onError(res =>
{
  if (res.graphQLErrors || res.networkError)
  {
    //Log errors
    startGroup('GraphQL errors');
    if (res.networkError != null)
    {
      error(res.networkError);
    }

    if (res.graphQLErrors != null)
    {
      for (const err of res.graphQLErrors)
      {
        error(err);
      }
    }
    endGroup();

    //Fail the step
    setFailed('GraphQL request failed!');

    //Crash
    process.exit(1);
  }
});

//Instantiate the Apollo client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([
    errorLink,
    httpLink
  ])
});

//Export
export default client;