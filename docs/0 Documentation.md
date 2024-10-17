# Documentation for Distributed E-Commerce System

## 1. System Architecture Overview

System Components:

	•	CockroachDB (Sharding + Replication): A distributed SQL database that supports both sharding and replication to handle large-scale data storage and ensure high availability.
	•	Redis: A distributed in-memory cache for fast data access and real-time pub/sub communication.
	•	Kafka: A distributed message queue for inter-service communication and real-time event processing.
	•	Microservices: Independent services (Order, Inventory, Payment, Notification) that handle different responsibilities and communicate using Kafka.
	•	Load Balancer: Distributes traffic across microservices and database instances, ensuring fault tolerance and load distribution.

Architecture Diagram:

The following diagram illustrates the flow of data between components:

           +------------------+         +-------------------+
           |                  |         |                   |
           |    Order Service  |---------|   Kafka Broker    |
           |                  |         |                   |
           +------------------+         +-------------------+
                      |                          |
                      |                          |
           +------------------+         +-------------------+
           |                  |         |                   |
           | Inventory Service |---------|   Payment Service |
           | (Redis Cluster)   |         |                   |
           +------------------+         +-------------------+
                      |                          |
                      |                          |
           +---------------------------------------------+
           |             CockroachDB Cluster             |
           |       (Sharded and Replicated Data)         |
           +---------------------------------------------+

	•	CockroachDB: Contains a cluster of nodes distributed across regions for sharding and replication.
	•	Kafka: Acts as the message broker that connects all the microservices and enables event-driven communication.
	•	Redis: Serves as a cache for frequently accessed data (e.g., inventory status) and pub/sub for real-time notifications.
	•	Load Balancer: Ensures requests to services and CockroachDB are distributed to the correct nodes for scalability.

## 2. Running the Project Locally

Overview

This project demonstrates a distributed e-commerce platform using microservices with a sharded and replicated database, distributed caching, and message queues. The system leverages CockroachDB for distributed SQL, Redis for caching, and Kafka for real-time messaging.

System Components:

	•	CockroachDB: A distributed database with both sharding and replication for high availability and scalability.
	•	Redis: A distributed cache for fast lookups and real-time pub/sub communication.
	•	Kafka: A message queue for handling real-time communication between services.
	•	Microservices: Four services (Order, Inventory, Payment, Notification) that interact via Kafka.
	•	Load Balancers: To distribute traffic across services and database nodes.

Prerequisites:

	•	Docker and Docker Compose installed on your machine.
	•	Basic understanding of microservices, Docker, and distributed systems.

Installation:

	1.	Clone the repository:

git clone https://github.com/your-repo/distributed-ecommerce.git
cd distributed-ecommerce


	2.	Build and start all services using Docker Compose:

docker-compose up --build


	3.	Access the services via the following URLs:
	•	Order Service: http://localhost:3001
	•	Inventory Service: http://localhost:3002
	•	Payment Service: http://localhost:3003
	4.	Access CockroachDB UI for monitoring at:

http://localhost:8080



Microservices:

	•	Order Service: Handles order creation and updates. It publishes order events to Kafka.
	•	Inventory Service: Listens for order events, updates inventory in Redis, and stores inventory data in CockroachDB.
	•	Payment Service: Processes payments, updating the order status in CockroachDB.
	•	Notification Service: Sends notifications when events occur (such as order updates).

Running the System Locally:

The Docker Compose configuration will start:

	•	CockroachDB cluster with multiple nodes.
	•	Redis instance for caching.
	•	Kafka broker and Zookeeper.
	•	All microservices (Order, Inventory, Payment, Notification).

Each service is containerized and can be accessed locally on different ports.

## 3. Explanation of Distributed Principles Applied

Database Replication and Sharding (CockroachDB):

	•	Sharding: The database is partitioned across different nodes. Each node stores a subset of the data, ensuring the load is distributed, improving both performance and scalability.
	•	Replication: Data is replicated across multiple nodes to ensure fault tolerance and high availability. In case of a node failure, other nodes can serve the data.
	•	CockroachDB automatically handles both sharding and replication, which means it balances data and load across the cluster without requiring manual intervention.

Distributed Caching (Redis):

	•	Caching Strategy: Redis is used to cache frequently accessed data, such as product inventory details, to reduce database load and improve performance.
	•	Pub/Sub Mechanism: Redis’s pub/sub feature is used for real-time notifications, ensuring that all services are updated immediately when there is a significant change in the system (e.g., low stock alerts).

Message Queues (Kafka):

	•	Kafka is used as the central messaging backbone. Services publish events (like new orders) to Kafka topics, and other services (like the inventory and payment services) consume these events.
	•	This enables loose coupling between services. Services can scale independently, and if one service fails, messages can be replayed from Kafka, ensuring eventual consistency.

Load Balancing:

	•	Microservices: Load balancers distribute incoming requests to the appropriate service instances, ensuring that no single instance is overwhelmed.
	•	Database Load Balancing: CockroachDB uses automatic load balancing to distribute read/write queries across its cluster nodes, improving performance and fault tolerance.

This document provides a high-level overview of the distributed architecture you’re building, along with step-by-step instructions on how to run the system locally using Docker Compose.
