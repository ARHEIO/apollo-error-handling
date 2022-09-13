import React from 'react';
import { gql, useMutation, ApolloClient, ApolloProvider, InMemoryCache, useLazyQuery } from '@apollo/client';
import 'highlight.js/styles/github.css';
import { RenderJson } from './components/RenderJson';
import { Highlight } from './components/Highlight';

const Success = () => {
  const [execute, { data, loading, error }] = useMutation(gql`
    mutation {
      createBook {
        id
        title
        authorName
        rating
        genre
      }
    }
  `);

  return (
    <div>
      <h2>The success state!</h2>
      <p>The user gets a response that we can handle!</p>
      <Highlight language="language-typescript">
        {`
          const createBook = async () => {
            const book = {
              id: uuidv4(),
              title: 'The Colour out of Space',
              authorName: 'H. P. Lovecraft',
              rating: 4,
              genre: Genre.HORROR,
            }

            return book;
          }
        `}
      </Highlight>
      <button onClick={() => execute()}>Execute</button>
      <RenderJson>{{ loading, error, data }}</RenderJson>
    </div>
  )
}

const RecoverableError = () => {
  const [execute, { data, loading, error }] = useMutation(gql`
    mutation {
      updateBook(
        input: {
          title: "At the Mountains of Madness"
          authorName: "H. P. Lovecraft"
          rating: 3
          genre: HORROR
        }
      ) {
        ... on Book {
          id
          title
          authorName
          genre
        }
        ... on FieldErrors {
          errors {
            field
            message
          }
        }
      }
    }
  `);

  return (
    <div>
      <h2>Recoverable Error</h2>
      <p>The user get an error back, BUT they can do something to fix it.</p>
      <Highlight language="language-typescript">
        {`
          const updateBook = async () => {
            const fieldErrors = {
              errors: [
                {
                  field: 'authorName',
                  message: 'maybe if you weren\'t a nerd we\'d let you update that book'
                }
              ]
            };

            return fieldErrors;
          }
        `}
      </Highlight>
      <button onClick={() => execute()}>Execute</button>
      <RenderJson>{{ loading, error, data }}</RenderJson>
    </div>
  )
}

const UnrecoverableDomainError = () => {
  const [execute, { loading, error, data }] = useMutation(gql`
    mutation {
      deleteBook {
        id
      }
    }
  `);

  return (
    <div>
      <h2>Unrecoverable Domain Error</h2>
      <p>It doesn't matter what the user does, they will always get this error because they do not meet some requirement.</p>
      <Highlight language="language-typescript">
        {`
          const deleteBook = async () => {
            throw new Error('only an admin can delete books');
          }
        `}
      </Highlight>
      <button onClick={() => execute()}>Execute</button>
      <RenderJson>{{ loading, error, data }}</RenderJson>
    </div>
  )
}

const UncaughtRuntimeError = () => {
  const [execute, { loading, error, data }] = useLazyQuery(gql`
    query {
      book {
        id
      }
    }
  `, {
    variables: {
      id: "4",
    },
  });

  return (
    <div>
      <h2>Uncaught Runtime Error</h2>
      <p>Some uncaught exception occurs.</p>
      <Highlight language="language-typescript">
        {`
          const book = async (_: never, { id }: { id: string }) => {
            const book = {
              id,
              title: 'The Colour out of Space',
              authorName: 'H. P. Lovecraft',
              rating: 4,
              genre: Genre.HORROR,
            }

            // @ts-expect-error
            console.log(foobarbaz);

            return book;
          };
        `}
      </Highlight>
      <button onClick={() => execute()}>Execute</button>
      <RenderJson>{{ loading, error, data }}</RenderJson>
    </div>
  )
}

const UnrecoverableSchemaError = () => {
  const [execute, { loading, error, data }] = useMutation(gql`
    mutation {
      deleteABookMaybeIfYouWant {
        id
      }
    }
  `);

  return (
    <div>
      <h2>Unrecoverable Schema Error</h2>
      <p>It doesn't matter what the user does, they will always get this error because the developers have made a mistake.</p>
      <button onClick={() => execute()}>Execute</button>
      <RenderJson>{{ loading, error, data }}</RenderJson>
    </div>
  )
}

const client = new ApolloClient({
  uri: '/.netlify/functions/graphql',
  cache: new InMemoryCache(),
});

const App = () => (
  <ApolloProvider client={client}>
    <Success />
    <br />
    <RecoverableError />
    <br />
    <UnrecoverableDomainError />
    <br />
    <UncaughtRuntimeError />
    <br />
    <UnrecoverableSchemaError />
  </ApolloProvider>
);

export default App
