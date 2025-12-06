import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({
      uri: environment.apiUrl,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network' as const,
        errorPolicy: 'all' as const,
      },
      query: {
        fetchPolicy: 'network-only' as const,
        errorPolicy: 'all' as const,
      },
      mutate: {
        errorPolicy: 'all' as const,
      },
    },
  };
}
