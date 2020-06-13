import { Document } from 'mongoose'

export interface ISession extends Document {
  title: string
  description?: string
  speaker?: string[]
  startsAt?: Date
  endsAt?: Date
  venue?: string
  type?: string[]
  attendees?: string[]
}
