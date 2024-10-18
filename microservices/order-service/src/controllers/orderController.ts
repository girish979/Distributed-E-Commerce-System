import { Kafka } from 'kafkajs';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'order-service',
  brokers: ['kafka:9092'], // Use service name 'kafka' instead of 'localhost'
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

export { createOrder };