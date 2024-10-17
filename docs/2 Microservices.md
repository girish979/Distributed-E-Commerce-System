Set up Node.js with TypeScript for your microservices now, before moving on to Redis.

Step-by-Step: Setting Up Node.js Microservices with TypeScript

1. Project Structure

We’ll create a simple microservice structure for each service. The structure will be as follows:

    /microservices
        /order-service
        /inventory-service
        /payment-service
        /notification-service

Each service will have its own folder, and we’ll set them up individually using Node.js and TypeScript.

Step 1.1: Initialize the Order Service with TypeScript

1.	Create the order-service folder:

```
mkdir -p microservices/order-service
cd microservices/order-service
```


2.	Initialize the service with npm:

`npm init -y`


3.	Install the required dependencies:
•	Express.js: for creating the REST API.
•	TypeScript: for type safety and development.
•	ts-node: for running TypeScript directly in Node.js.
•	pg: for connecting to CockroachDB.

`npm install express pg`  
`npm install typescript ts-node @types/node @types/express --save-dev`


4.	Create a tsconfig.json file:
This file will tell TypeScript how to compile your code.
```
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true, // Required for using CommonJS with TypeScript
    "moduleResolution": "node" // Makes sure the modules are properly resolved
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```


5.	Set up the directory structure:
Inside the order-service folder, create the following structure:
```
/src
  /controllers
  /routes
  /services
  app.ts
```

6.	Create a basic Express app in app.ts:
Inside src/app.ts, add the following code to create a basic Express server:
```
import express, { Request, Response } from 'express';
const app = express();

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Order Service is running!');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Order service is listening on port ${PORT}`);
});
```

7.	Modify `package.json` scripts:
In your `package.json`, add a script to run the TypeScript code using ts-node:
```
"scripts": {
  "start": "ts-node-dev --respawn src/app.ts",
}
```

8.	Run the Order Service:

`npm start`

You should see the message:

Order service is listening on port 3001

You can now visit http://localhost:3001 and see the message “Order Service is running!”

Step 1.2: Repeat the Setup for Other Services

You can now follow the same steps to set up the following services:

	•	Inventory Service (on port 3002).
	•	Payment Service (on port 3003).
	•	Notification Service (on port 3004).

Each service will follow the same structure but will handle its specific logic. For example:

	•	Order Service will handle incoming orders.
	•	Inventory Service will update inventory after receiving events from Kafka.
	•	Payment Service will handle payment processing.
	•	Notification Service will send notifications when events occur.

Step 1.3: Setup Docker for Each Service

	1.	Create a Dockerfile for each service:
Inside each service folder (e.g., order-service), create a Dockerfile:
```
# Use the official Node.js image as the base
FROM node:14-alpine

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
#RUN npm run build

# Expose the port the service will run on
EXPOSE 3001

# Start the application
CMD ["npm", "start"]
```

Repeat this process for each service, ensuring you adjust the port numbers as needed (e.g., 3002 for inventory-service, 3003 for payment-service).

	2.	Modify docker-compose.yml to Include Microservices
In your docker-compose.yml, you can add each microservice like this:
```
version: '3'
services:
  cockroachdb1:
    image: cockroachdb/cockroach:v21.1.6
    command: start --insecure --join=cockroachdb1,cockroachdb2,cockroachdb3
    ports:
      - "26257:26257"
      - "8080:8080"
    volumes:
      - ./cockroach-data1:/cockroach/cockroach-data
    networks:
      - cockroachnet
    platform: linux/amd64  # Specify platform

  cockroachdb2:
    image: cockroachdb/cockroach:v21.1.6
    command: start --insecure --join=cockroachdb1,cockroachdb2,cockroachdb3
    ports:
      - "26258:26257"
      - "8081:8080"
    volumes:
      - ./cockroach-data2:/cockroach/cockroach-data
    networks:
      - cockroachnet
    platform: linux/amd64  # Specify platform

  cockroachdb3:
    image: cockroachdb/cockroach:v21.1.6
    command: start --insecure --join=cockroachdb1,cockroachdb2,cockroachdb3
    ports:
      - "26259:26257"
      - "8082:8080"
    volumes:
      - ./cockroach-data3:/cockroach/cockroach-data
    networks:
      - cockroachnet
    platform: linux/amd64  # Specify platform

  init:
    image: cockroachdb/cockroach:v21.1.6
    command: init --insecure --host=cockroachdb1
    depends_on:
      - cockroachdb1
    networks:
      - cockroachnet
    platform: linux/amd64  # Specify platform

  # Order Service
  order-service:
    build: ./microservices/order-service
    ports:
      - "3001:3001"
    depends_on:
      - cockroachdb1
    networks:
      - cockroachnet

  # Inventory Service
  inventory-service:
    build: ./microservices/inventory-service
    ports:
      - "3002:3002"
    depends_on:
      - cockroachdb1
    networks:
      - cockroachnet

  # Payment Service
  payment-service:
    build: ./microservices/payment-service
    ports:
      - "3003:3003"
    depends_on:
      - cockroachdb1
    networks:
      - cockroachnet

networks:
  cockroachnet:
    driver: bridge
```
