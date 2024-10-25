import { Kafka, logLevel } from 'kafkajs';

// Kafka client configuration
const kafka = new Kafka({
  brokers: ['localhost:29092', 'localhost:29093', 'localhost:29094'],
  logLevel: logLevel.INFO,
});

const admin = kafka.admin();
const producer = kafka.producer();
const topicName = 'test-topic';
const numPartitions = 3; // Number of partitions for the topic

// Function to create partitions if they don't exist
async function createTopicIfNotExists() {
  await admin.connect();

  const topics = await admin.listTopics();
  if (!topics.includes(topicName)) {
    console.log(`Topic ${topicName} not found. Creating...`);
    await admin.createTopics({
      topics: [
        {
          topic: topicName,
          numPartitions,
          replicationFactor: 2,
        },
      ],
    });
    console.log(`Topic ${topicName} created with ${numPartitions} partitions.`);
  } else {
    console.log(`Topic ${topicName} already exists.`);
  }

  await admin.disconnect();
}

// Function to send bulk events to Kafka
async function sendBulkEvents(count) {
  await producer.connect();

  for (let i = 0; i < count; i++) {
    const key = `key-${i % numPartitions}`; // Distribute messages based on key
    await producer.send({
      topic: topicName,
      messages: [{ 
        key,
        value: `Event number ${i}` 
      }],
    });
  }

  console.log(`${count} events sent to Kafka.`);
  await producer.disconnect();
}

// Run the script
async function run() {
  try {
    await createTopicIfNotExists();
    await sendBulkEvents(100); // Send 10,000 events
  } catch (err) {
    console.error('Error in Kafka operations:', err);
  }
}

run();