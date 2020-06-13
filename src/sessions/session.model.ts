import { Model, model, Schema } from 'mongoose'
import { ISession } from './session.interface'

const sessionSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
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
  startsAt: {
    type: Date,
  },
  endsAt: {
    type: Date,
  },
  venue: {
    type: String,
  },
  type: {
    type: String,
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
