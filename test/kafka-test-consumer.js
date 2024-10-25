import { Kafka } from 'kafkajs';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'consumer-app',
  brokers: ['localhost:29092', 'localhost:29093', 'localhost:29094']
});

// Create a consumer
const consumer = kafka.consumer({ groupId: 'test-group' });

async function consumeMessages() {
  // Connect to the broker
  await consumer.connect();
  
  // Subscribe to the topic
  await consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

  // Consume messages
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message on topic ${topic} partition ${partition}: ${message.value.toString()}`);
    },
  });
}

consumeMessages().catch(console.error);