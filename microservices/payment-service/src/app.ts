import  { Request, Response } from 'express';
import express from 'express';

const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Payment Service is running!');
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Payment service is listening on port ${PORT}`);
});