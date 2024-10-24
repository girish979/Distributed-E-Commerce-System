Set up Redis as a distributed cache cluster to complete the distributed caching aspect of your system. Redis will handle fast lookups, caching, and pub/sub messaging.

## Redis Cluster Setup

We’ll configure Redis as a cluster to support sharding and replication. This setup will ensure that your cache is scalable and fault-tolerant, distributing data across multiple nodes.

### Step 1: Update Docker Compose for Redis Cluster

We need to modify the Docker Compose file to set up multiple Redis nodes and configure them to form a cluster.

1.	Add Redis Cluster Nodes to docker-compose.yml:

Here, we are setting up six Redis nodes (3 primary nodes and 3 replica nodes) for the cluster. We also expose them on different ports.
```
  # Redis Cluster Nodes
  redis-node1:
    image: redis:7.0
    command: ["redis-server", "--port", "6379", "--cluster-enabled", "yes", "--cluster-config-file", "nodes.conf", "--cluster-node-timeout", "5000", "--appendonly", "yes"]
    ports:
      - "6379:6379"
    networks:
      - cockroachnet

  redis-node2:
    image: redis:7.0
    command: ["redis-server", "--port", "6380", "--cluster-enabled", "yes", "--cluster-config-file", "nodes.conf", "--cluster-node-timeout", "5000", "--appendonly", "yes"]
    ports:
      - "6380:6380"
    networks:
      - cockroachnet

  redis-node3:
    image: redis:7.0
    command: ["redis-server", "--port", "6381", "--cluster-enabled", "yes", "--cluster-config-file", "nodes.conf", "--cluster-node-timeout", "5000", "--appendonly", "yes"]
    ports:
      - "6381:6381"
    networks:
      - cockroachnet

  redis-node4:
    image: redis:7.0
    command: ["redis-server", "--port", "6382", "--cluster-enabled", "yes", "--cluster-config-file", "nodes.conf", "--cluster-node-timeout", "5000", "--appendonly", "yes"]
    ports:
      - "6382:6382"
    networks:
      - cockroachnet

  redis-node5:
    image: redis:7.0
    command: ["redis-server", "--port", "6383", "--cluster-enabled", "yes", "--cluster-config-file", "nodes.conf", "--cluster-node-timeout", "5000", "--appendonly", "yes"]
    ports:
      - "6383:6383"
    networks:
      - cockroachnet

  redis-node6:
    image: redis:7.0
    command: ["redis-server", "--port", "6384", "--cluster-enabled", "yes", "--cluster-config-file", "nodes.conf", "--cluster-node-timeout", "5000", "--appendonly", "yes"]
    ports:
      - "6384:6384"
    networks:
      - cockroachnet

  redis-init:
    image: redis:7.0
    depends_on:
      - redis-node1
      - redis-node2
      - redis-node3
      - redis-node4
      - redis-node5
      - redis-node6
    entrypoint:
      - /bin/sh
      - -c
      - |
        sleep 10
        redis-cli --cluster create \
          redis-node1:6379 redis-node2:6380 redis-node3:6381 \
          redis-node4:6382 redis-node5:6383 redis-node6:6384 \
          --cluster-replicas 1 --cluster-yes
    networks:
      - cockroachnet
```
These Redis nodes will form a cluster to handle distributed caching with sharding and replication.

Running below commands will give cluster information
```
% docker exec -it distributed-ecom-redis-node1-1 redis-cli -p 6379 cluster info

#output
cluster_state:ok
cluster_slots_assigned:16384
cluster_slots_ok:16384
cluster_slots_pfail:0
cluster_slots_fail:0
cluster_known_nodes:6
cluster_size:3
cluster_current_epoch:6
cluster_my_epoch:1
cluster_stats_messages_ping_sent:781
cluster_stats_messages_pong_sent:790
cluster_stats_messages_sent:1571
cluster_stats_messages_ping_received:785
cluster_stats_messages_pong_received:781
cluster_stats_messages_meet_received:5
cluster_stats_messages_received:1571
total_cluster_links_buffer_limit_exceeded:0
```

```
% docker exec -it distributed-ecom-redis-node1-1 redis-cli -p 6379 cluster nodes

#Output
9273dd0ae8ab8b3caa0f3de1689aa3020b22f0ed 172.22.0.3:6383@16383 slave c34144e82bbfd7873787f4f5452b4beb2a16fa60 0 1729754232054 1 connected
da8b6c216f34545291b44782171c33ea96ef11c7 172.22.0.7:6380@16380 master - 0 1729754232000 2 connected 5461-10922
a5c7736cd8eba55b17179405ddd8aa465a71bf05 172.22.0.4:6381@16381 master - 0 1729754232863 3 connected 10923-16383
8496bb03e6242783c1d49b9616f5cdae440ce700 172.22.0.2:6384@16384 slave da8b6c216f34545291b44782171c33ea96ef11c7 0 1729754231000 2 connected
c34144e82bbfd7873787f4f5452b4beb2a16fa60 172.22.0.8:6379@16379 myself,master - 0 1729754232000 1 connected 0-5460
9607c9713016f51f450687fbecb8ce214ee567f9 172.22.0.6:6382@16382 slave a5c7736cd8eba55b17179405ddd8aa465a71bf05 0 1729754232000 3 connected
```



### Step 2: Connect Node.js Microservices to Redis Cluster

Now that Redis is set up as a distributed cluster, let’s connect your Node.js services to it. We’ll use ioredis, which has built-in support for Redis clusters.

1.	Install ioredis in each microservice:

```npm install ioredis```


2.	In your service (e.g., order-service), update your src/app.ts or create a redisClient.ts to initialize the Redis Cluster connection:

```
import Redis from 'ioredis';

// Initialize Redis Cluster
const redisCluster = new Redis.Cluster([
  { host: 'redis-node1', port: 6379 },
  { host: 'redis-node2', port: 6380 },
  { host: 'redis-node3', port: 6381 },
  { host: 'redis-node4', port: 6382 },
  { host: 'redis-node5', port: 6383 },
  { host: 'redis-node6', port: 6384 },
]);

// Handle connection errors
redisCluster.on('error', (err) => {
  console.error('Redis Cluster Error:', err);
});

// Export the Redis Cluster client
export default redisCluster;
```

### Step 3: Use Redis for Caching in Microservices

You can now use Redis in your microservices to cache frequently accessed data.

Example: Caching in Order Service

For example, in the Order Service, you might want to cache order details to avoid repeated database queries:
in `orderController.ts` add below
```
import redis from '../redisClient';

// Function to get order with Redis caching
// Mock function to simulate fetching order data from the "database"
async function getOrderFromDB(orderId: string): Promise<any> {
  // Simulated database response
  return {
    id: orderId,
    product: 'Laptop',
    quantity: 1,
    status: 'Processed',
  };
}

async function getOrder(req: Request, res: Response) {
  const orderId = req.params.id;

  try {
    // Check if the order is cached in Redis
    const cachedOrder = await redis.get(`order:${orderId}`);
    if (cachedOrder) {
      console.log(`Cache hit for order ${orderId}`);
      return res.json(JSON.parse(cachedOrder));
    }

    console.log(`Cache miss for order ${orderId}`);
    // If not cached, fetch from the "database"
    const orderData = await getOrderFromDB(orderId);

    // Cache the order data in Redis with a TTL of 1 hour (3600 seconds)
    await redis.set(`order:${orderId}`, JSON.stringify(orderData), 'EX', 3600);

    return res.json(orderData);
  } catch (err) {
    console.error('Error in getOrder:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
```
and add below to `app.ts`
```
// Route to get order data with caching
app.get('/orders/:id', (req: Request, res: Response, next: NextFunction) => {
  getOrder(req, res).catch(next);  // Handle async errors properly
});
```
In this example:

•	When an order is requested, the service first checks if the order exists in Redis.  
•	If the order is cached, it returns the cached result. Otherwise, it queries CockroachDB and then caches the result in Redis.

### Step 4: Test Redis Cluster with Microservices
Create an order and check the caching mechanism:  
•	Access the Order Service endpoint 2 times:
`GET http://localhost:3001/orders/1`
•	If the order is not cached, the service will fetch it from the database and cache it in Redis.
check the docker logs
```
2024-10-24 13:16:50 [INFO] 07:46:50 ts-node-dev ver. 2.0.0 (using ts-node ver. 10.9.2, typescript ver. 5.6.3)
2024-10-24 13:16:55 Order service is listening on port 3001
2024-10-24 13:17:06 Cache miss for order 1
2024-10-24 13:17:36 Cache hit for order 1
```

Connect to redis cluster
```
docker exec -it distributed-ecom-redis-node1-1 redis-cli -c -p 6379
```
Then run commands
```
% get order:1

#output
127.0.0.1:6379> get order:1
-> Redirected to slot [14374] located at 172.22.0.5:6381
"{\"id\":\"1\",\"product\":\"Laptop\",\"quantity\":1,\"status\":\"Processed\"}"
172.22.0.5:6381> 

#keys *
% keys *
1) "order:1"
```

Check which node has the key
```shell
% cluster slots

#output
1) 1) (integer) 0
   2) (integer) 5460
   3) 1) "172.22.0.7"
      2) (integer) 6379
      3) "f25ecd11717a892a2bda7503c5d432e17935b646"
      4) (empty array)
   4) 1) "172.22.0.8"
      2) (integer) 6383
      3) "0df598a7a36ea7e3adfdbb9091b405ce73a2d0aa"
      4) (empty array)
2) 1) (integer) 5461
   2) (integer) 10922
   3) 1) "172.22.0.2"
      2) (integer) 6380
      3) "6bb92aa665d7e7aa22014e26c9d4e342d03f1c81"
      4) (empty array)
   4) 1) "172.22.0.11"
      2) (integer) 6384
      3) "e396b36e7ddc481581e18c1b59e5bde01b803a8e"
      4) (empty array)
3) 1) (integer) 10923
   2) (integer) 16383
   3) 1) "172.22.0.5"
      2) (integer) 6381
      3) "e3f1da656e5db5b05c7c8c157571705685b41259"
      4) (empty array)
   4) 1) "172.22.0.4"
      2) (integer) 6382
      3) "77edc94f717d83db052443a7b4ca248399071753"
      4) (empty array)
```