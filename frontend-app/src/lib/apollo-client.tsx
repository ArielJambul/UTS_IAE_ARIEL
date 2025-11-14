'use client';

import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:4000/graphql',
});

// Modifikasi authLink untuk mengambil token dari localStorage
const authLink = setContext((_, { headers }) => {
  // Cek apakah kode berjalan di browser sebelum mengakses localStorage
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '', // Tambahkan token ke header
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}