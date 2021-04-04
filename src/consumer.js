const { Kafka } = require('kafkajs')
const config = require('./config')

const kafka = new Kafka({
  brokers: config.kafka.BROKERS,
  clientId: config.kafka.CLIENTID
})

const topic = config.kafka.TOPIC
const consumer = kafka.consumer({
  groupId: config.kafka.GROUPID
})

const run = async() =>{
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async({ message }) => {
      console.log({
        value: message.value.toString()
      })
    }
  })
}

run()