import { Model, model, Schema } from 'mongoose'
import { ISession } from './session.interface'

const sessionSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  startsAt: {
    type: Date,
    required: true,
  },
  endsAt: {
    type: Date,
    required: true,
  },
  type: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
    },
  },
  description: {
    type: String,
  },
  speaker: [
    {
      ref: 'Person',
      type: Schema.Types.ObjectId,
    },
  ],
  venue: {
    type: String,
  },
  address: {
    type: String,
  },
  seats: {
    type: Number,
  },
  attendees: [
    {
      ref: 'Person',
      type: Schema.Types.ObjectId,
    },
  ],
})

const SessionModel: Model<ISession> = model('Session', sessionSchema)

export default SessionModel
