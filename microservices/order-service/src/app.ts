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