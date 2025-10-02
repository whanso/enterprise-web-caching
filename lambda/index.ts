import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import * as awsServerlessExpress from 'aws-serverless-express';
import express from 'express';

// Create the Express app
const app = express();
app.get('/', (req, res) => {
  res.send('<h1>Hello, World from Express!</h1>');
});

// Create the server
const server = awsServerlessExpress.createServer(app);

// Create the handler
export const handler = (event: APIGatewayProxyEvent, context: Context) => {
  awsServerlessExpress.proxy(server, event, context);
};
