const Redis = require('ioredis')

/*const client = new Redis(
  "rediss://default:7d356306ed9548fba64fbcef3f5e6a16@usw2-flowing-bullfrog-30109.upstash.io",
  {
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
  }
);

(async () => {
  const result = await client.hgetall('CauseGroupImpactMetric_CA6A5C2uj')
  console.log(result)
})();*/

// const Redis = require("ioredis");

let client = new Redis("rediss://default:7d356306ed9548fba64fbcef3f5e6a16@usw2-flowing-bullfrog-30109.upstash.io:30109");
client.set('foo', 'bar');

