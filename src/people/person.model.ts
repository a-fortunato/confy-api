import { Model, model, Schema } from 'mongoose'
import { IPerson } from './person.interface'

const personSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  photoUrl: {
    type: String,
  },
  website: {
    type: String,
  },
})

personSchema.virtual('fullName').get(function (this: IPerson) {
  return `${this.firstName} ${this.lastName}`
})

const PersonModel: Model<IPerson> = model('Person', personSchema)

export default PersonModel
