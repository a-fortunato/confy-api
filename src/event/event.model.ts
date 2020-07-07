import { model, Model, Schema } from 'mongoose'
import { IEvent } from './event.interface'

const eventSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  venue: {
    type: String,
  },
  city: {
    type: String,
    required: true,
  },
  startingDate: {
    type: Date,
    required: true,
  },
  endingDate: {
    type: Date,
    required: true,
  },
})

const EventModel: Model<IEvent> = model('Event', eventSchema)

export default EventModel
