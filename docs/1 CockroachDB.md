
## CockroachDB setup
Set up CockroachDB with both sharding and replication to ensure a distributed, highly available, and scalable database

CockroachDB Features:

	•	Sharding: CockroachDB automatically shards data across nodes by dividing data into ranges. Each range is stored on multiple nodes for fault tolerance.
	•	Replication: CockroachDB replicates data across multiple nodes, ensuring high availability. If a node fails, data is served from another node.
Setup the docker-compose and run `docker compose up -d`

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

networks:
  cockroachnet:
    driver: bridge
```

Once done it should be initialized as well, if not run below
```
docker exec -it <container-id-of-cockroachdb1> ./cockroach init --insecure
```
Then open 
`http://localhost:8080`

### Verify Sharding and Replication

By default, CockroachDB automatically handles both sharding and replication. You can verify this in the Admin UI:

	•	Sharding: Data is divided into “ranges” and distributed across nodes.
	•	Replication: Each range is replicated on multiple nodes for fault tolerance.


### Simulate Node Failure

To see CockroachDB’s fault tolerance in action, you can simulate the failure of one of the nodes:
```
docker stop <container-id-of-cockroachdb1>
```

Now check the CockroachDB Admin UI again. You should see that the cluster is still operational, and data is still accessible because of the replicas stored on the other nodes.