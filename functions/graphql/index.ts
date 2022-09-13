import { Handler } from '@netlify/functions';
import { ApolloServer, gql } from 'apollo-server-lambda';
import { v4 as uuidv4 } from 'uuid';

enum Genre {
  ACTION_ADVENTURE = "ACTION_ADVENTURE",
  HORROR = "HORROR",
}

const typeDefs = gql`
  """Genres of book"""
  enum Genre {
    ACTION_ADVENTURE
    HORROR
  }

  type FieldError {
    field: String!
    message: String
  }

  type FieldErrors {
    errors: [FieldError!]!
  }

  type Book {
    authorName: String!
    genre: Genre!
    id: ID!
    rating: Int!
    title: String!
  }


  union BookOrFieldErrors = Book | FieldErrors

  type Query {
    book(id: String!): Book!
    getBook: Book!
  }

  type Mutation {
    createBook: Book!
    deleteBook: Book!
    updateBook(input: UpdateBookInput!): BookOrFieldErrors!
    updateReview(id: ID!, input: UpdateReviewInput!): Query!
  }

  input UpdateBookInput {
    authorName: String!
    genre: Genre
    rating: Int!
    title: String!
  }

  input UpdateReviewInput {
    rating: Int
    review: String
  }
`;

const Query = {
  book: async (_: never, { id }: { id: string }) => {
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
  }
}

const Mutation = {
  createBook: async () => {
    const book = {
      id: uuidv4(),
      title: 'The Colour out of Space',
      authorName: 'H. P. Lovecraft',
      rating: 4,
      genre: Genre.HORROR,
    }

    return book;
  },
  updateBook: async () => {
    const fieldErrors = {
      errors: [{
        field: 'authorName',
        message: 'maybe if you weren\'t a nerd we\'d let you update that book'
      }]
    };

    return fieldErrors;
  },
  deleteBook: async () => {
    throw new Error('only an admin can delete books');
  },
}

const resolvers = {
  BookOrFieldErrors: {
    __resolveType: (obj: any) => obj.errors ? 'FieldErrors' : 'Book',
  },
  Query,
  Mutation,
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const apolloHandler = server.createHandler();

export const handler: Handler = async (event, context: any, cb = () => null) => {
  await new Promise<void>((resolve) => setTimeout(() => resolve(), 500));

  return apolloHandler(
    {
      ...event,
      requestContext: context,
    },
    context,
    cb,
  );
};
