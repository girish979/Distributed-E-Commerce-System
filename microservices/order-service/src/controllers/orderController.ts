import { Kafka } from 'kafkajs';
import { Request, Response } from 'express';
import redis from '../redisClient';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
});

const producer = kafka.producer();

async function createOrder(orderData: any) {
  try {
    console.log(`create order ${orderData}`);
    await producer.connect();
    // Ensure that the message contains a proper value
    await producer.send({
      topic: 'order-events',
      messages: [
        { value: JSON.stringify(orderData) }, // Ensure 'value' is a proper JSON string
      ],
    });
    await producer.disconnect();
    console.log('Order created and sent to Kafka:', orderData);
  } catch (error) {
    console.error('Error creating order:', error);
  }
}

// Mock function to simulate fetching order data from the "database"
async function getOrderFromDB(orderId: string): Promise<any> {
  // Simulated database response
  return {
    id: orderId,
    product: 'Laptop',
    quantity: 1,
    status: 'Processed',
  };
}


// Function to get order with Redis caching
async function getOrder(req: Request, res: Response) {
  const orderId = req.params.id;

  try {
    // Check if the order is cached in Redis
    const cachedOrder = await redis.get(`order:${orderId}`);
    if (cachedOrder) {
      console.log(`Cache hit for order ${orderId}`);
      return res.json(JSON.parse(cachedOrder));
    }

    console.log(`Cache miss for order ${orderId}`);
    // If not cached, fetch from the "database"
    const orderData = await getOrderFromDB(orderId);

    // Cache the order data in Redis with a TTL of 1 hour (3600 seconds)
    await redis.set(`order:${orderId}`, JSON.stringify(orderData), 'EX', 3600);

    return res.json(orderData);
  } catch (err) {
    console.error('Error in getOrder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export { createOrder, getOrder };