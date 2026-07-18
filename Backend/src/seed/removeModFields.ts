import mongoose from 'mongoose'
import { config } from '../config/env'

async function run() {
  await mongoose.connect(config.mongodbUri)
  const collection = mongoose.connection.db!.collection('mods')

  const result = await collection.updateOne(
    { _id: new mongoose.Types.ObjectId('6a5bb58b2980718a407da65f') },
    { $unset: { screenshots: '', thumbnail: '', features: '' } }
  )

  console.log(`Modified: ${result.modifiedCount}`)

  const updated = await collection.findOne({ _id: new mongoose.Types.ObjectId('6a5bb58b2980718a407da65f') })
  console.log('screenshots:', updated?.screenshots)
  console.log('thumbnail:', updated?.thumbnail)
  console.log('features:', updated?.features)

  await mongoose.disconnect()
}

run()
