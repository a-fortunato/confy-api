import { Model, model, Schema } from 'mongoose'
import { IPerson } from './person.interface'

const personSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  nickName: {
    type: String,
  },
  avatar: {
    src: {
      type: String,
    },
  },
  website: {
    type: String,
  },
})

const PersonModel: Model<IPerson> = model('Person', personSchema)

export default PersonModel
