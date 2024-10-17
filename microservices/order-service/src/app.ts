import  { Request, Response } from 'express';
import express from 'express';

const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Order Service is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Order service is listening on port ${PORT}`);
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