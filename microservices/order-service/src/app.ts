import  { Request, Response, NextFunction } from 'express';
import express from 'express';
import { createOrder, getOrder } from './controllers/orderController';

const app = express();

// Add middleware to parse JSON request bodies
app.use(express.json());

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Order Service is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Order service is listening on port ${PORT}`);
});

// POST route for creating an order
app.post('/orders', (req: Request, res: Response) => {
  const orderData = req.body;

  console.log(`order-service: Order data: ${JSON.stringify(orderData)}`);
  
  // Call the createOrder function to handle Kafka message publishing
  createOrder(orderData)
    .then(() => res.status(201).send('Order created successfully'))
    .catch((error) => {
      console.error('Error creating order:', error);
      res.status(500).send('Failed to create order');
    });
});

// Route to get order data with caching
app.get('/orders/:id', (req: Request, res: Response, next: NextFunction) => {
  getOrder(req, res).catch(next);  // Handle async errors properly
});



/* CockroachDb Connection */

// import { Client } from 'pg';

// // Connection string for the CockroachDB cluster
// const client = new Client({
//   user: 'root',
//   host: 'cockroachdb1',  // the service name of the first CockroachDB node
//   database: 'defaultdb',
//   port: 26257,
//   ssl: false,  // since we are using --insecure
// });

// client.connect()
//   .then(() => console.log('Connected to CockroachDB'))
//   .catch((err: Error) => console.error('Connection error', err.stack));

// // Example query with typed parameters
// client.query('SELECT NOW()', (err: Error | null, res: any) => {
//   if (err) {
//     console.error(err);
//   } else {
//     console.log('Current Time:', res.rows);
//   }
//   client.end();
// });