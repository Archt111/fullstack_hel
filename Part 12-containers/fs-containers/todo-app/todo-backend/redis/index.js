const redis = require('redis')
const { REDIS_URL } = require('../util/config')

let set
let get

if (!REDIS_URL) {
  const redisIsDisabled = () => {
    console.log('No REDIS_URL set, Redis is disabled')
    return null
  }
  set = redisIsDisabled
  get = redisIsDisabled
} else {
  let client = redis.createClient({url: REDIS_URL })
  client.on('error', (err) => console.log('Redis Client Error', err))

  const connectPromise = client.connect()
  connectPromise.then(() => {
    console.log('Connected to Redis')
  })

  const withConnection = (operation) => async (...args) => {
    await connectPromise
    return operation(...args)
  }

  get = withConnection((...args) => client.get(...args))
  set = withConnection((...args) => client.set(...args))
}

module.exports = {
  get,
  set,
}
