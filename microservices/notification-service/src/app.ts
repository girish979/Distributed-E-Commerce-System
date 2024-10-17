import  { Request, Response } from 'express';
import express from 'express';

const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Notification Service is running!');
});

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  console.log(`Notification service is listening on port ${PORT}`);
});