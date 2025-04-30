import Redis from "ioredis";



console.log(process.env.REDIS_HOST,process.env.REDIS_PORT,process.env.REDIS_PASSWORD);
const redis = new Redis("rediss://default:AS2FAAIjcDEyZTgwZjMyNzFmM2Y0NWM2YTgxNjI2MDgyZTE5ZGI1M3AxMA@driven-ibex-11653.upstash.io:6379");
redis.on("error",(err)=>{
  console.log(err,"error from redis");
})
export default redis