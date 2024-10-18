//TODO

Set up Kafka for microservices to handle event-driven communication.

Step-by-Step: Kafka Setup in Docker Compose

Kafka relies on Zookeeper to manage the cluster, so we’ll also set up Zookeeper in our Docker Compose file. Then, we will configure Kafka to act as the message broker for inter-service communication.

Step 1: Add Zookeeper and Kafka to docker-compose.yml

Add Zookeeper and Kafka services to docker-compose.yml file:

```yaml
  zookeeper:
    image: bitnami/zookeeper:latest
    environment:
      - ZOO_ENABLE_AUTH=yes
    ports:
      - "2181:2181"
    networks:
      - cockroachnet

  kafka:
    image: bitnami/kafka:latest
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: PLAINTEXT:PLAINTEXT,PLAINTEXT_HOST:PLAINTEXT
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9092
      KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9092
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
    ports:
      - "9092:9092"
    networks:
      - cockroachnet
    depends_on:
      - zookeeper
```

Step 2: Configure Kafka for Docker

In the Kafka service:

	•	KAFKA_ADVERTISED_LISTENERS: Sets the broker’s address for services to connect.
	•	KAFKA_ZOOKEEPER_CONNECT: Ensures that Kafka connects to Zookeeper to manage the broker.

This configuration will run Kafka on port 9092 and Zookeeper on port 2181. Both are required for Kafka to function properly in a distributed setup.

Step 3: Rebuild and Start Docker Containers

Run the following command to rebuild and start the services with Kafka and Zookeeper:

`docker-compose up --build -d`

This will now start CockroachDB, Node.js microservices, Zookeeper, and Kafka.

Step 4: Connect Node.js Microservices to Kafka

Next, let’s connect microservices to Kafka. We’ll use the kafkajs package in Node.js, which is a popular and easy-to-use Kafka client.

Step 4.1: Install Kafka Client (kafkajs) in Node.js

In each microservice (e.g., order-service), install kafkajs:

`npm install kafkajs`

Step 4.2: Example Kafka Producer and Consumer (Order Service)

Here’s how you can set up a Kafka Producer in the Order Service to publish messages when a new order is placed, and a Kafka Consumer in the Inventory Service to consume those messages.

Order Service (Producer):

Inside src/controllers/orderController.ts:

```javascript
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
```
Create `/order` route
in order-service `src/app.ts` add the route code to existing

```javascript

import { createOrder } from './controllers/orderController';

// Add middleware to parse JSON request bodies
app.use(express.json());

// POST route for creating an order
app.post('/orders', (req: Request, res: Response) => {
  const orderData = req.body;

  console.log(`order-service: Order data: ${JSON.stringify(orderData)}`);
  
  // Call the createOrder function to handle Kafka message publishing
  createOrder(orderData)
    .then(() => res.status(201).send('Order created successfully'))
    .catch((error) => {
      console.error('Error creating order:', error);
      res.status(500).send('Failed to create order');
    });
});

```

When a new order is created, the order data will be published to the order-events Kafka topic.

Inventory Service (Consumer):

Inside `src/controllers/inventoryController.ts`:
```ts
import { Kafka } from 'kafkajs';

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'inventory-service',
  brokers: ['kafka:9092'], // Kafka broker address
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
```

start listening to kafka in inventory-service app.ts, update the listen function and import required

```ts
import { consumeOrderEvents } from './controllers/inventoryController';

app.listen(PORT, () => {
  console.log(`Inventory service is listening on port ${PORT}`);

  // Start consuming order events from Kafka
  consumeOrderEvents();
});
```
This setup allows the Inventory Service to consume order events and update inventory accordingly.

Step 4.3: Initialize Kafka in Microservices

Update the microservices to initialize Kafka upon startup. For example, in order-service’s src/app.ts, make sure to trigger the Kafka producer after an order is created.

Step 5: Test Kafka Integration

1.	Start all services:

`docker compose down`

`docker compose up --build -d`


2.	Create an order via the Order Service (e.g., using Postman or a browser):

POST http://localhost:3001/orders
BODY 
{
  "orderId": "1234",
  "customerId": "5678",
  "product": "Laptop",
  "quantity": 11
}


3.	Check the logs of the Inventory Service to see if it has consumed the message:

docker logs <inventory-service-container-id>



You should see that the Inventory Service receives the order event from Kafka and logs it.
