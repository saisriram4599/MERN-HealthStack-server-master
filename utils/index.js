const redis = require('redis');

const client = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
});

client.connect()
.then(() => {
    console.log('Redis connected')
})
.catch((err) => {
    console.log(err.message)
})

client.del("nithin5736")
// client.disconnect()
