import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  brokers: ['localhost:29092', 'localhost:29093', 'localhost:29094']
});
const producer = kafka.producer();

async function sendBulkEvents(count) {
  await producer.connect();

  for (let i = 0; i < count; i++) {
    await producer.send({
      topic: 'test-topic',
      messages: [{ value: `Event number ${i}` }],
    });
  }

  console.log(`${count} events sent to Kafka.`);
  await producer.disconnect();
}

sendBulkEvents(100).catch(console.error);