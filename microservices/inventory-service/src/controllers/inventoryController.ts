import { Kafka } from 'kafkajs';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'],
});

const consumer = kafka.consumer({ groupId: 'inventory-group' });

async function consumeOrderEvents() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const orderData = JSON.parse(message.value?.toString() || '{}');
      console.log(`Received order event: `, orderData);
      // Update inventory based on the order data
    },
  });
}

export { consumeOrderEvents };