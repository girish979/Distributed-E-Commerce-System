# WIP
## Overview

1.	Setup Distributed  
	- NoSQL Database (Cassandra)  
	- Cache (Redis)  
	- Event Processing (Kafka) 
2. Codebase: Microservices written in Node.js.
3.	Documentation:
	- Overview of the system architecture (diagrams and explanations).
    - README on how to run the project locally using Docker Compose.
	- Explanation of distributed principles applied: database replication, caching strategies, message queues, and load balancing.

----------------------------------------------------------------
## Requirements
- Node 20
- Docker

## Run the project
```bash
#build and run the containers
docker compose up --build -d

# to delete the containers
docker compose down
```


## UIs

### Cockroach DB UI
- [http://localhost:8080](http://localhost:8080)
- [http://localhost:8081](http://localhost:8081)
- [http://localhost:8082](http://localhost:8082)


### Kafka

[http://localhost:8090](http://localhost:8090)


### Redis
[http://localhost:5540](http://localhost:5540)

In the redis insight dash board add the hosts

| Node  | host  | port  |
|---|---|---|
| Node1  | `distributed-ecom-redis-node1-1`  | 6379  |
| Node2  | `distributed-ecom-redis-node2-1`  | 6380  |
| Node3  | `distributed-ecom-redis-node3-1`  | 6381  |
| Node4  | `distributed-ecom-redis-node4-1`  | 6382  |
| Node5  | `distributed-ecom-redis-node5-1`  | 6383  |
| Node6  | `distributed-ecom-redis-node6-1`  | 6384  |


### Grafana
[http://localhost:3000/login](http://localhost:3000/login)


## Generate Traffic

use the scripts inside `/test` to generate traffic


## Sample Data

### Kafka
![Kafka](docs/images/kafka-1.png)

![alt text](docs/images/kafka-topic-1.png)

![alt text](docs/images/kafka-messages-1.png)
