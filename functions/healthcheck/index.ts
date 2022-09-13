import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  console.log('the healthcheck was called');

  return {
    statusCode: 200,
    body: ':)',
    headers: {
      'content-type': 'text/plain',
    },
  };
};
