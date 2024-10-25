import Redis from 'ioredis';

// Initialize the Redis cluster
const redis = new Redis.Cluster([
  { host: 'localhost', port: 6379 },
//   { host: 'localhost', port: 6380 },
//   { host: 'localhost', port: 6381 }
]);

async function generateRedisTraffic(count) {
    console.log('generating traffic');
    
  try {
    for (let i = 0; i < count; i += 100) {
        console.log('1');
      const pipeline = redis.pipeline();
      console.log('2');

      for (let j = i; j < i + 100 && j < count; j++) {
        // Use a hash tag to ensure keys hash to the same slot
        const key = `{bulkKey}:key-${j}`;
        console.log('3');
        pipeline.set(key, `value-${j}`);
        console.log('4');
        pipeline.get(key);
      }

      const results = await pipeline.exec();
      results.forEach(([err, result], index) => {
        if (err) {
          console.error(`Error at index ${i + index}:`, err);
        }
      });
    }
    console.log(`${count} operations on Redis.`);
  } catch (error) {
    console.error('Error in generateRedisTraffic:', error);
  }
}

generateRedisTraffic(10000).catch(console.error);