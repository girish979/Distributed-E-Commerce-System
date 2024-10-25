import { Kafka } from 'kafkajs';

const kafka = new Kafka({ brokers: ['kafka1:9092', 'kafka2:9093', 'kafka3:9094'] });
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

sendBulkEvents(1000).catch(console.error);