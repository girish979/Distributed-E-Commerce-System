import  { Request, Response } from 'express';
import express from 'express';
import { consumeOrderEvents } from './controllers/inventoryController';


const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Inventory Service is running!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Inventory service is listening on port ${PORT}`);

  // Start consuming order events from Kafka
  consumeOrderEvents();
});