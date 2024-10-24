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