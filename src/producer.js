const { Kafka } = require('kafkajs')
const config = require('./config')
const axios = require('axios')

const client = new Kafka({
  brokers: config.kafka.BROKERS,
  clientId: config.kafka.CLIENTID
})

const topic = config.kafka.TOPIC

const producer = client.producer()

const randomAccount = async(producer, topic) =>{
  await producer.connect()
  let i = 1
  setInterval(async function() {
    i = i >= 6 ? 0 : i + 1
    let random = Math.floor(Math.random()*(6-1)+1)
    const data = await axios.get(`http://localhost:3000/account/${random}`)
    let payloads = {
      topic: topic,
      messages: [
        { key: 'userAccount', value: JSON.stringify(data.data)}
      ]
    }
    console.log(payloads)
    producer.send(payloads)
  }, 5000)
}

randomAccount(producer, topic)