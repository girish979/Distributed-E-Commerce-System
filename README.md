Deliverables for the Project:

	1.	Codebase: Microservices written in Node.js.
	2.	Documentation:
		- Overview of the system architecture (diagrams and explanations).
        - README on how to run the project locally using Docker Compose.
		- Explanation of distributed principles applied: database replication, caching strategies, message queues, and load balancing.
	3.	GitHub Repo: Ensure all components are clearly documented, including setup instructions.
	4.	Deployed Version (Optional): You can deploy the project on a cloud platform (AWS, GCP, Azure) to demonstrate a real-world environment with scalability.

----------------------------------------------------------------
Use node 20

docker compose down
docker compose up --build -d


## UIs

Cockroach DB UI
```
http://localhost:8080
http://localhost:8081
http://localhost:8082
```

Kafka
```
http://localhost:8090
```

Redis
`http://localhost:5540/`  
add redis db using 
```
host: distributed-ecom-redis-node1-1   Port:6379
host: distributed-ecom-redis-node2-1   Port:6380
host: distributed-ecom-redis-node3-1   Port:6380
host: distributed-ecom-redis-node4-1   Port:6382
host: distributed-ecom-redis-node5-1   Port:6383
host: distributed-ecom-redis-node6-1   Port:6384
```
Grafana
```
http://localhost:3000/login
```

