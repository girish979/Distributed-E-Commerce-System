import  { Request, Response } from 'express';
import express from 'express';

const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Inventory Service is running!');
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`Inventory service is listening on port ${PORT}`);
});